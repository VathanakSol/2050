export const adsenseConfig = {
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
  adSlots: {
    header: process.env.NEXT_PUBLIC_ADSENSE_HEADER_AD_SLOT || '',
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_SLOT || '',
    footer: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_AD_SLOT || '',
    inArticle: process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_AD_SLOT || '',
  },
  // Enable/disable ads based on environment
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
};