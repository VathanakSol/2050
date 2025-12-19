'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  dataAdClient: string;
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdBanner({
  dataAdClient,
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  style = { display: 'block' },
  className = '',
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={dataAdClient}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive}
    />
  );
}