import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const featureRequestSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  details: z.string().trim().min(1, 'Details are required'),
  contact: z
    .union([z.string().email(), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  category: z.enum(['product', 'quality', 'integration', 'other']).optional(),
});

export async function POST(request: NextRequest) {
  const slackToken = process.env.SLACK_BOT_TOKEN;
  const slackChannel = process.env.SLACK_FEATURE_REQUEST_CHANNEL;

  if (!slackToken || !slackChannel) {
    return NextResponse.json(
      {
        error:
          'Slack is not configured. Set SLACK_BOT_TOKEN and SLACK_FEATURE_REQUEST_CHANNEL.',
      },
      { status: 500 }
    );
  }

  let body: z.infer<typeof featureRequestSchema>;

  try {
    const json = await request.json();
    body = featureRequestSchema.parse(json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    );
  }

  const { title, details, contact, category } = body;
  const now = new Date().toISOString();

  const text = [
    `*New feature request* ${category ? `• ${category}` : ''}`,
    `*Title:* ${title}`,
    `*Details:* ${details}`,
    contact ? `*Contact:* ${contact}` : '*Contact:* (not provided)',
    `*Submitted:* ${now}`,
  ].join('\n');

  try {
    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${slackToken}`,
      },
      body: JSON.stringify({
        channel: slackChannel,
        text,
        mrkdwn: true,
      }),
    });

    const slackResult = await slackResponse.json();

    if (!slackResponse.ok || !slackResult.ok) {
      console.error('Slack API error', slackResult);
      return NextResponse.json(
        {
          error: 'Failed to send to Slack',
          details: slackResult.error || 'Unknown Slack error',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      ts: slackResult.ts,
    });
  } catch (error) {
    console.error('Slack request failed', error);
    return NextResponse.json(
      { error: 'Unable to submit request' },
      { status: 500 }
    );
  }
}
