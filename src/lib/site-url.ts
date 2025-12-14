import 'server-only';

export const DEFAULT_SITE_URL = 'https://refiner.vercel.app';

const toAbsoluteHttpsUrl = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  return `https://${value}`;
};

export const getSiteUrl = () => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? toAbsoluteHttpsUrl(process.env.VERCEL_URL) : undefined) ??
    DEFAULT_SITE_URL;

  try {
    return new URL(raw);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
};

