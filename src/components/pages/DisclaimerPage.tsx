import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AlertTriangle, ShieldCheck, Scale, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'hi' ? 'कानूनी अस्वीकरण' : 'Legal Disclaimer'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'अस्वीकरण (Disclaimer)' : 'Disclaimer'}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          {language === 'hi'
            ? 'अंतिम संशोधन: हालिया • स्वतंत्र उपयोगिता सूचना'
            : 'Last Updated: Recent • Independent Utility Notice'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
        {/* Important Notice Banner */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-amber-950 text-base">
              {language === 'hi'
                ? 'सरकारी संस्थाओं से गैर-संबद्धता की स्पष्ट घोषणा'
                : 'Notice of Non-Affiliation and Independence'}
            </h2>
            <p className="text-xs md:text-sm text-amber-900 leading-relaxed">
              {language === 'hi'
                ? 'AI Photo Lab (aiphotolab.publicvm.com) एक स्वतंत्र, निजी वेब उपयोगिता सॉफ्टवेयर है। यह किसी भी सरकारी विभाग, मंत्रालय, भर्ती आयोग (जैसे SSC, UPSC, NTA, IBPS, Railways RRB, State PSCs) या आधिकारिक परीक्षा एजेंसी से संबद्ध, अनुमोदित या आधिकारिक रूप से जुड़ा हुआ नहीं है।'
                : 'AI Photo Lab (aiphotolab.publicvm.com) is an independent, non-governmental web utility platform. We are NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with any government agency, exam conducting body (such as SSC, UPSC, NTA, IBPS, RRB, State PSCs), or official government portal.'}
            </p>
          </div>
        </div>

        {/* Section 1: Informational & Reference Purpose */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '1. सूचनात्मक और शैक्षिक उद्देश्य (Educational & Reference Purpose)'
                : '1. Informational & Educational Purpose'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हमारी वेबसाइट पर उपलब्ध सभी परीक्षा प्रीसेट (जैसे SSC CGL, UPSC Civil Services, IBPS PO, NEET UG, JEE Main, PAN Card, Driving License आदि) केवल उपयोगकर्ताओं की उत्पादकता और संदर्भ सुविधा के लिए प्रदान किए गए हैं।'
              : 'All exam presets, document dimensions, resolution standards, and file size recommendations listed on AI Photo Lab are aggregated from publicly available notification guidelines solely to assist candidates and users in formatting their files efficiently.'}
          </p>
          <p>
            {language === 'hi'
              ? 'विभिन्न सरकारी भर्ती बोर्ड समय-समय पर अपनी फोटो और हस्ताक्षर संबंधित आवश्यकताओं में बदलाव कर सकते हैं। उपयोगकर्ताओं को दृढ़ता से सलाह दी जाती है कि वे किसी भी फॉर्म को अंतिम रूप से सबमिट करने से पहले संबंधित आयोग की आधिकारिक अधिसूचना और दिशा-निर्देशों की स्वयं जांच अवश्य करें।'
              : 'Examination authorities periodically revise and update their official digital photograph and signature submission guidelines. Users are strongly advised to cross-verify the latest official notification on the respective government portal before final application submission.'}
          </p>
        </section>

        {/* Section 2: No Guarantee & Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '2. दायित्व की सीमा (Limitation of Liability)'
                : '2. Limitation of Liability'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab अपने टूल्स को सर्वोत्तम परिशुद्धता और उच्च गुणवत्ता के साथ प्रदान करने का पूर्ण प्रयास करता है। फिर भी, यह सेवा "जैसी है" (AS IS) आधार पर बिना किसी स्पष्ट या निहित वारंटी के उपलब्ध कराई जाती है।'
              : 'AI Photo Lab provides automated image compression, resizing, and passport photo generation tools on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.'}
          </p>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab, इसके डेवलपर्स या सहयोगी किसी भी परीक्षा फॉर्म के अस्वीकार होने, तकनीकी त्रुटि, सिस्टम असंगतता, या सेवा के उपयोग से उत्पन्न होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं होंगे।'
              : 'Under no circumstances shall AI Photo Lab, its owners, or contributors be held liable for any rejected application forms, examination disqualifications, loss of data, or any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this service.'}
          </p>
        </section>

        {/* Section 3: Client-Side Processing & Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>
              {language === 'hi'
                ? '3. डेटा सुरक्षा और गोपनीयता आश्वासन'
                : '3. Data Security & Privacy Guarantee'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम किसी भी उपयोगकर्ता के दस्तावेज, फोटोग्राफ या हस्ताक्षर को अपने सर्वर पर अपलोड या संग्रहीत नहीं करते हैं। सभी कार्य पूरी तरह से आपके ब्राउज़र की लोकल मेमोरी में निष्पादित होते हैं, जिससे आपकी गोपनीयता शत-प्रतिशत सुरक्षित रहती है।'
              : 'All photo adjustments, dimension resizing, background editing, and video compression occur strictly in-memory on your local device using client-side JavaScript APIs. We do not store, view, or retain your personal photos or documents on any remote server.'}
          </p>
        </section>

        {/* Section 4: Trademarks & Third-Party References */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '4. ट्रेडमार्क और तृतीय-पक्ष संदर्भ (Trademarks)'
                : '4. Trademarks & Brand Names'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'इस वेबसाइट पर उल्लिखित सभी ट्रेडमार्क, लोगो, संस्थाओं के नाम (जैसे SSC, UPSC, NTA, IBPS, Google, WhatsApp, Discord आदि) उनके संबंधित स्वामियों की संपत्ति हैं। उनका संदर्भ केवल पहचान और वर्णनात्मक प्रयोजनों के लिए किया गया है और यह किसी प्रकार के समर्थन या साझेदारी का संकेत नहीं देता है।'
              : 'All trademarks, logos, examination names, and brand references (including SSC, UPSC, NTA, IBPS, Google, WhatsApp, Discord, etc.) mentioned on this site are the intellectual property of their respective trademark holders. Their mention does not imply any sponsorship, affiliation, endorsement, or licensing agreement.'}
          </p>
        </section>

        {/* Section 5: Contact for Inquiries */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {language === 'hi'
              ? 'अस्वीकरण से संबंधित प्रश्नों के लिए हमसे संपर्क करें:'
              : 'For inquiries regarding this disclaimer, please contact:'}
          </div>
          <a
            href="mailto:apextech.servicess@gmail.com"
            className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1"
          >
            <span>apextech.servicess@gmail.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
