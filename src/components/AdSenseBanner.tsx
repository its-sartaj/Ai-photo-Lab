import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export type AdSlotType =
  | 'header'
  | 'in-content'
  | 'sidebar'
  | 'download'
  | 'processing'
  | 'leaderboard'
  | 'rectangle';

interface AdSenseBannerProps {
  slotType?: AdSlotType;
  className?: string;
  onOpenAdGuide?: () => void;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotType = 'leaderboard',
  className = '',
}) => {
  const { language } = useLanguage();

  // Normalize slotType into standard class and style configs
  const getSlotConfig = (type: AdSlotType) => {
    switch (type) {
      case 'header':
      case 'leaderboard':
        return {
          slotClass: 'ad-banner-header',
          containerClass: 'min-h-[90px] md:min-h-[100px] w-full max-w-5xl mx-auto my-6',
          label: language === 'hi' ? 'विज्ञापन (SPONSORED)' : 'SPONSORED / ADVERTISEMENT',
          subtext: language === 'hi'
            ? 'AdSense हेडर बैनर स्थान। मुख्य नेविगेशन और एक्शन बटनों से सुरक्षित दूरी।'
            : 'AdSense Header Slot • Safely separated from primary navigation and action buttons.',
        };
      case 'in-content':
        return {
          slotClass: 'ad-in-content',
          containerClass: 'min-h-[120px] md:min-h-[140px] w-full max-w-4xl mx-auto my-10',
          label: language === 'hi' ? 'विज्ञापन स्थान (SPONSORED CONTENT)' : 'SPONSORED / ADVERTISEMENT',
          subtext: language === 'hi'
            ? 'कंटेंट व ट्यूटोरियल के बीच अनुशंसित गैर-आक्रामक विज्ञापन क्षेत्र।'
            : 'In-content native ad container placed between editorial guide sections.',
        };
      case 'sidebar':
        return {
          slotClass: 'ad-sidebar',
          containerClass: 'min-h-[300px] md:min-h-[600px] w-full max-w-[300px] mx-auto my-4',
          label: language === 'hi' ? 'प्रायोजित (SIDEBAR AD)' : 'SPONSORED ADVERTISEMENT',
          subtext: language === 'hi'
            ? 'साइडबार विज्ञापन स्लॉट'
            : 'Responsive skyscraper / vertical sidebar ad container.',
        };
      case 'download':
        return {
          slotClass: 'ad-download-slot',
          // Generous top/bottom margin prevents accidental click traps near actual download buttons
          containerClass: 'min-h-[120px] w-full max-w-4xl mx-auto my-12 pt-6 pb-4 border-t-2 border-dashed border-slate-200',
          label: language === 'hi' ? 'प्रायोजित लिंक (ADVERTISEMENT - NOT A DOWNLOAD BUTTON)' : 'SPONSORED ADVERTISEMENT • NOT A DOWNLOAD BUTTON',
          subtext: language === 'hi'
            ? 'डाउनलोड बटन से पूर्णतः अलग रखा गया सुरक्षित विज्ञापन स्थान (पॉलिसी के अनुसार आकस्मिक क्लिक निषिद्ध है)।'
            : 'Policy-Compliant Download Slot: Kept with generous safety margin away from genuine download triggers to prevent accidental clicks.',
        };
      case 'processing':
        return {
          slotClass: 'ad-processing-slot',
          containerClass: 'min-h-[160px] w-full max-w-md mx-auto my-6',
          label: language === 'hi' ? 'प्रायोजित (SPONSORED)' : 'SPONSORED MESSAGE',
          subtext: language === 'hi'
            ? 'फाइल प्रोसेसिंग के दौरान प्रदर्शित होने वाला सुरक्षित विज्ञापन स्लॉट।'
            : 'Compliant processing screen ad container active during on-device encoding.',
        };
      case 'rectangle':
      default:
        return {
          slotClass: 'ad-in-content',
          containerClass: 'min-h-[250px] max-w-sm mx-auto my-6',
          label: language === 'hi' ? 'विज्ञापन स्थान (ADVERTISEMENT)' : 'SPONSORED / ADVERTISEMENT',
          subtext: language === 'hi'
            ? 'Google AdSense 300x250 मीडियम रेक्टेंगल स्लॉट।'
            : 'Google AdSense Medium Rectangle Placement.',
        };
    }
  };

  const config = getSlotConfig(slotType);

  return (
    <aside
      className={`${config.slotClass} ${config.containerClass} px-4 select-none ${className}`}
      aria-label="Advertisement Container"
    >
      <div className="flex items-center justify-between pb-1.5 px-1 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
          {config.label}
        </span>
        <span className="text-[10px] text-slate-500 font-normal">AdSense Compliant</span>
      </div>

      <div className="rounded-xl border border-dashed border-purple-200 bg-purple-50/40 hover:bg-purple-50/70 flex flex-col items-center justify-center text-center p-4 transition-all duration-200 hover:border-purple-300">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-2 shadow-2xs">
          Ad
        </div>
        <p className="text-xs md:text-sm font-semibold text-slate-700">
          {language === 'hi'
            ? 'Google AdSense आरक्षित विज्ञापन क्षेत्र'
            : 'Google AdSense Placement Area'}
        </p>
        <p className="text-[11px] md:text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          {config.subtext}
        </p>
      </div>
    </aside>
  );
};
