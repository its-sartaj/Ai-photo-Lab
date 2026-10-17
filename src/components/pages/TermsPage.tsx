import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'उपयोग के नियम' : 'Terms of Service'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'नियम व शर्तें (Terms of Service)' : 'Terms of Service'}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          {language === 'hi'
            ? 'अंतिम संशोधन: अक्टूबर 2026'
            : 'Last Updated: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
        {/* Section 1: Acceptance */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {language === 'hi' ? '1. शर्तों की स्वीकृति' : '1. Acceptance of Terms'}
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab की वेबसाइट या इसके किसी भी टूल का उपयोग करके, आप इन नियमों व शर्तों से बंधे होने की सहमति देते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया सेवा का उपयोग न करें।'
              : 'By accessing or utilizing AI Photo Lab tools and tutorials, you agree to comply with and be bound by these Terms of Service. If you do not agree, please discontinue using the website.'}
          </p>
        </section>

        {/* Section 2: User Content & Ownership */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {language === 'hi'
              ? '2. आपकी फोटो पर पूर्ण अधिकार (100% Ownership)'
              : '2. Intellectual Property & Your Images'}
          </h2>
          <p>
            {language === 'hi'
              ? 'आपकी किसी भी फोटो, इमेज या फाइल पर AI Photo Lab का कोई अधिकार या स्वामित्व नहीं है। आपके द्वारा एडिट या डाउनलोड की गई सभी फोटो का 100% कॉपीराइट केवल आपके पास सुरक्षित रहता है।'
              : 'AI Photo Lab claims zero copyright, ownership, or intellectual property rights over any images, graphics, or documents you process. All rights remain solely with you or the respective original copyright holder.'}
          </p>
        </section>

        {/* Section 3: Permitted & Prohibited Use */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {language === 'hi' ? '3. उचित उपयोग नीति' : '3. Acceptable Use Policy'}
          </h2>
          <p>
            {language === 'hi'
              ? 'आप इस सेवा का उपयोग किसी भी अवैध गतिविधि, दूसरों के अधिकारों का उल्लंघन करने वाली सामग्री बनाने, या दुर्भावनापूर्ण स्क्रिप्ट चलाने के लिए नहीं कर सकते हैं।'
              : 'You agree not to use our browser utilities for any unlawful purpose, to distribute malicious scripts, or in violation of applicable laws and regulations.'}
          </p>
        </section>

        {/* Section 4: Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {language === 'hi' ? '4. वारंटी अस्वीकरण (Disclaimer)' : '4. Disclaimer of Warranties'}
          </h2>
          <p>
            {language === 'hi'
              ? 'यह सेवा "जैसी है" (AS IS) आधार पर मुफ्त प्रदान की जाती है। हालांकि हम टूल्स की सटीकता और कार्यक्षमता बनाए रखने का पूरा प्रयास करते हैं, लेकिन हम किसी भी डेटा हानि या अप्रत्याशित तकनीकी त्रुटि के लिए उत्तरदायी नहीं होंगे।'
              : 'AI Photo Lab tools are provided on an "as-is" and "as-available" basis without express or implied warranties. While we strive for optimal client-side fidelity, we do not warrant that operation will be error-free or uninterrupted across all hardware.'}
          </p>
        </section>

        {/* Section 5: Inquiries */}
        <section className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p>
            {language === 'hi'
              ? 'शर्तों के संबंध में पूछताछ के लिए apextech.servicess@gmail.com पर संपर्क करें।'
              : 'For inquiries regarding our terms, write to apextech.servicess@gmail.com.'}
          </p>
        </section>
      </div>
    </div>
  );
};
