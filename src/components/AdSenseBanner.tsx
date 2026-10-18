import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface AdSenseBannerProps {
  slotType?: 'leaderboard' | 'rectangle' | 'in-content';
  className?: string;
  onOpenAdGuide?: () => void;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotType = 'leaderboard',
  className = '',
}) => {
  const { language } = useLanguage();

  return (
    <div
      className={`my-8 mx-auto w-full max-w-5xl px-4 select-none ${className}`}
      aria-label="Advertisement Container"
    >
      <div className="flex items-center justify-between pb-1.5 px-2 text-xs text-slate-600 font-medium tracking-wider uppercase">
        <span>
          {language === 'hi' ? 'विज्ञापन स्थान (ADVERTISEMENT)' : 'SPONSORED / ADVERTISEMENT'}
        </span>
      </div>

      <div
        className={`rounded-xl border border-dashed border-purple-200 bg-purple-50/50 flex flex-col items-center justify-center text-center p-4 transition-all duration-200 hover:border-purple-300 ${
          slotType === 'rectangle'
            ? 'min-h-[250px] max-w-sm mx-auto'
            : slotType === 'in-content'
            ? 'min-h-[120px]'
            : 'min-h-[90px] md:min-h-[100px]'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs mb-2">
          Ad
        </div>
        <p className="text-sm font-semibold text-slate-700">
          {language === 'hi'
            ? 'Google AdSense के लिए आरक्षित विज्ञापन क्षेत्र'
            : 'Google AdSense Placement Area'}
        </p>
        <p className="text-xs text-slate-500 max-w-md mt-1">
          {language === 'hi'
            ? 'AdSense अकाउंट अप्रूव होने के बाद यहाँ वैध विज्ञापन प्रदर्शित होंगे। यह स्थान डाउनलोड बटनों से सुरक्षित दूरी पर रखा गया है।'
            : 'Compliant responsive placeholder. Once approved by Google AdSense, real ads will render here with safe margins away from tool action buttons.'}
        </p>
      </div>
    </div>
  );
};
