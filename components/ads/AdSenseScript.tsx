'use client';

import Script from 'next/script';

interface AdSenseScriptProps {
  publisherId: string;
}

export function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}