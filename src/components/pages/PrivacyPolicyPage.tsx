import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Lock, EyeOff, Server, Cookie, HelpCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          {language === 'hi'
            ? 'अंतिम संशोधन: अक्टूबर 2026 • प्रभावी तिथि: तत्काल'
            : 'Last Updated: October 2026 • Effective Immediately'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
        {/* Core Guarantee */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-emerald-950 text-sm">
              {language === 'hi'
                ? 'हमारा मूल गोपनीयता वादा: कोई सर्वर अपलोड नहीं'
                : 'Our Core Promise: Zero Image Uploads'}
            </h2>
            <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
              {language === 'hi'
                ? 'जब आप AI Photo Lab पर किसी फोटो को कंप्रेस, रीसाइज, कन्वर्ट या क्रॉप करते हैं, तो वह फोटो कभी भी आपके डिवाइस से बाहर नहीं जाती। सभी ऑपरेशन्स आपके वेब ब्राउज़र (HTML5 Canvas) में ही लोकल मेमोरी में होते हैं।'
                : 'When you use AI Photo Lab, your photos never leave your device. All image manipulations occur strictly in-memory inside your browser client. We do not store, view, or upload your photos to any remote server.'}
            </p>
          </div>
        </div>

        {/* Section 1: Information We Do Not Collect */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '1. वह जानकारी जो हम एकत्र नहीं करते'
                : '1. Information We Do Not Collect'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम किसी भी प्रकार का व्यक्तिगत डेटा, आपकी अपलोड की गई फोटो, मेटाडेटा (EXIF डेटा), बायोमेट्रिक जानकारी या निजी पहचान दस्तावेज एकत्र या स्टोर नहीं करते हैं।'
              : 'We do not collect or store personal photographs, EXIF camera metadata, facial biometrics, or identification documents. The files you choose are processed exclusively through client-side JavaScript APIs.'}
          </p>
        </section>

        {/* Section 2: Cookies & Third-Party Advertising */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '2. कुकीज़ और Google AdSense विज्ञापन नीति'
                : '2. Cookies & Google AdSense Advertising Disclosures'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab इस सेवा को मुफ्त बनाए रखने के लिए भविष्य में Google AdSense जैसे तृतीय-पक्ष विज्ञापन नेटवर्क का उपयोग कर सकता है। Google सहित अन्य तृतीय-पक्ष वेंडर वेबसाइट पर आपकी पिछली यात्राओं के आधार पर विज्ञापन प्रदर्शित करने के लिए कुकीज़ (जैसे DoubleClick कुकी) का उपयोग करते हैं।'
              : 'AI Photo Lab may serve advertisements provided by third-party advertising partners, including Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the Internet.'}
          </p>
          <p>
            {language === 'hi'
              ? 'उपयोगकर्ता व्यक्तिगत विज्ञापनों से बाहर निकलने (Opt-out) के लिए Google की Ads Settings (www.google.com/settings/ads) पर जा सकते हैं, या www.aboutads.info पर जाकर तृतीय-पक्ष कुकीज़ को अक्षम कर सकते हैं।'
              : 'Users may opt out of personalized advertising by visiting Google Ads Settings (www.google.com/settings/ads) or through www.aboutads.info.'}
          </p>
        </section>

        {/* Section 3: Local Storage */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '3. ब्राउज़र लोकल स्टोरेज (Local Storage)'
                : '3. Browser Local Storage'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम आपकी भाषा पसंद (हिंदी या अंग्रेजी) को याद रखने के लिए केवल ब्राउज़र के लोकल स्टोरेज का उपयोग करते हैं। इसमें कोई संवेदनशील जानकारी शामिल नहीं होती।'
              : 'We utilize your browser local storage solely to remember your preferred interface language (English or Hindi). No tracking or sensitive identifying information is stored.'}
          </p>
        </section>

        {/* Section 4: Contact */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'hi' ? '4. संपर्क व प्रश्न' : '4. Questions & Privacy Contact'}
          </h2>
          <p>
            {language === 'hi'
              ? 'इस गोपनीयता नीति से संबंधित किसी भी प्रश्न के लिए आप हमें apextech.servicess@gmail.com पर लिख सकते हैं।'
              : 'If you have any questions or concerns regarding our privacy practices, please contact us at apextech.servicess@gmail.com.'}
          </p>
        </section>
      </div>
    </div>
  );
};
