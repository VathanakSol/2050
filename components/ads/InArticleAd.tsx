'use client';

import { AdBanner } from './AdBanner';

interface InArticleAdProps {
  dataAdClient: string;
  dataAdSlot: string;
  className?: string;
}

export function InArticleAd({ dataAdClient, dataAdSlot, className }: InArticleAdProps) {
  return (
    <div className={`w-full flex justify-center my-6 ${className || ''}`}>
      <AdBanner
        dataAdClient={dataAdClient}
        dataAdSlot={dataAdSlot}
        dataAdFormat="fluid"
        dataFullWidthResponsive={true}
        style={{ display: 'block', textAlign: 'center' }}
        className="adsbygoogle"
      />
    </div>
  );
}