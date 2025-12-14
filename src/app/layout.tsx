import { getSiteUrl } from '@/lib/site-url';
import type { Metadata } from 'next';
import { Merriweather, Raleway } from 'next/font/google';
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
  title: 'Refiner - Improve Your English Writing',
  description: 'A tool that transforms your sentences into natural, grammatically correct English.',
  metadataBase: SITE_URL,
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Refiner - Improve Your English Writing',
    description:
      'A tool that transforms your sentences into natural, grammatically correct English.',
    url: SITE_URL,
    siteName: 'Refiner',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Refiner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refiner - Improve Your English Writing',
    description:
      'A tool that transforms your sentences into natural, grammatically correct English.',
    images: ['/og.png'],
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
