import localFont from 'next/font/local';
import './globals.css';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import TransitionWrapper from '@/components/TransitionWrapper';
import DynamicCursor from '../components/DynamicCursor/DynamicCursor';
import { CursorProvider } from '../contexts/CursorContext';
import Dock from '@/components/Dock/Dock';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'vynn',
  description: 'Design is cool, I guess.',
  keywords: ['Design', 'Development', 'UI', 'UX', 'Web design'],
  authors: [{ name: 'vynn' }],
  openGraph: {
    title: 'vynn',
    description: 'Design is cool, I guess.',
    url: 'https://vynn.pro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vynn_lee',
  },
  alternates: {
    canonical: 'https://vynn.pro',
    languages: {
      en: 'https://vynn.pro/en',
      ko: 'https://vynn.pro/ko',
    },
  },
};

function isMobileDevice(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userAgent = headers().get('user-agent') || '';
  const isMobile = isMobileDevice(userAgent);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-y-scroll md:overflow-hidden antialiased bg-white dark:bg-neutral-900`}
      >
        <CursorProvider>
          {!isMobile && (
            <DynamicCursor
              size={28} // 커서 크기 설정
              fillColor="white" // SVG의 fill 색상 설정
            />
          )}
          <div className="pointer-events-none fixed left-0 top-0 z-50 h-16 w-full bg-neutral-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-neutral-900"></div>
          <TransitionWrapper>
            {children}
          </TransitionWrapper>
          <Dock />
        </CursorProvider>
      </body>
    </html>
  );
}
