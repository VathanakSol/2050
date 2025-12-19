'use client';

import { AdBanner } from './AdBanner';

interface ResponsiveAdProps {
  dataAdClient: string;
  dataAdSlot: string;
  className?: string;
}

export function ResponsiveAd({ dataAdClient, dataAdSlot, className }: ResponsiveAdProps) {
  return (
    <div className={`w-full flex justify-center my-4 ${className || ''}`}>
      <AdBanner
        dataAdClient={dataAdClient}
        dataAdSlot={dataAdSlot}
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }}
      />
    </div>
  );
}