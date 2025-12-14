import type { Metadata } from 'next';
import { Merriweather, Raleway } from 'next/font/google';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';
import Providers from './providers';

const SITE_URL = getSiteUrl();

const bodyFont = Merriweather({
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

const accentFont = Raleway({
  variable: '--font-raleway',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'American English Refiner - Improve Your English Writing',
  description: 'An AI-powered tool that converts your sentences into natural, grammatically correct American English.',
  metadataBase: SITE_URL,
  openGraph: {
    title: 'American English Refiner - Improve Your English Writing',
    description:
      'An AI-powered tool that converts your sentences into natural, grammatically correct American English.',
    url: SITE_URL,
    siteName: 'American English Refiner',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'American English Refiner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'American English Refiner - Improve Your English Writing',
    description:
      'An AI-powered tool that converts your sentences into natural, grammatically correct American English.',
    images: ['/twitter-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${accentFont.variable} antialiased font-serif bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
