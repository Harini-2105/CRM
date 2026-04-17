import * as React from 'react';

export const OzofiLogo = ({ size = 32, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 450 450" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M225 45L375 120V270L225 345L75 270V120L225 45Z" fill="#3B82F6"/>
    <circle cx="225" cy="180" r="50" fill="#A855F7" fillOpacity="0.8"/>
    <path d="M75 150L225 225L375 150V210L225 285L75 210V150Z" fill="#22C55E"/>
    <path d="M75 220L225 295L375 220V280L225 355L75 280V220Z" fill="#F97316"/>
    <path d="M75 290L225 365L375 290V350L225 425L75 350V290Z" fill="#EF4444"/>
  </svg>
);
