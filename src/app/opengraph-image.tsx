import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'American English Refiner';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B1220 0%, #111827 45%, #0B1220 100%)',
          color: '#F9FAFB',
          padding: '72px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 36,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(17,24,39,0.6)',
            boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
            padding: 64,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(226,232,240,0.8)',
              }}
            >
              American English Refiner
            </div>
            <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 600 }}>
              Refine your English
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.35, color: 'rgba(226,232,240,0.9)' }}>
              Turn rough sentences into natural, grammatically correct American English.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 20, color: 'rgba(226,232,240,0.8)' }}>Try it free</div>
              <div style={{ fontSize: 24, color: '#93C5FD' }}>refiner.vercel.app</div>
            </div>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 36,
                background: 'radial-gradient(circle at 30% 30%, #60A5FA 0%, #2563EB 45%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                fontWeight: 700,
              }}
            >
              R
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

