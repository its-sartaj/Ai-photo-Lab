import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Cpu, Zap, Lock, Heart, Award, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 text-purple-600" />
          <span>{language === 'hi' ? 'हमारा मिशन' : 'Our Mission'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'AI Photo Lab के बारे में' : 'About AI Photo Lab'}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          {language === 'hi'
            ? 'सुरक्षित, निजी और तेज फोटो टूल्स को हर छात्र, पेशेवर और वेब डेवलपर तक मुफ्त पहुंचाना।'
            : 'Delivering secure, private, and ultra-fast photo manipulation tools to students, creators, and professionals worldwide.'}
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm md:text-base">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          {language === 'hi' ? 'हमने AI Photo Lab क्यों बनाया?' : 'Why We Built AI Photo Lab'}
        </h2>
        <p>
          {language === 'hi'
            ? 'आज इंटरनेट पर अधिकांश फोटो कंप्रेसर या कन्वर्टर वेबसाइटें आपकी निजी तस्वीरों, आधार कार्ड, मार्कशीट या पारिवारिक तस्वीरों को अपने रिमोट सर्वर पर अपलोड करवाती हैं। यह उपयोगकर्ताओं की प्राइवेसी के लिए एक बड़ा खतरा है।'
            : 'Most online photo utilities require you to upload your personal images—family portraits, ID cards, exam credentials, or confidential documents—to remote servers. This introduces unnecessary privacy and data leakage risks.'}
        </p>
        <p>
          {language === 'hi'
            ? 'AI Photo Lab को एक अलग सोच के साथ विकसित किया गया है: "100% क्लाइंट-साइड सुरक्षा"। इसका मतलब है कि आपकी फोटो कभी भी आपके कंप्यूटर या स्मार्टफोन से बाहर नहीं जाती। सभी गणितीय गणनाएं और पिक्सेल कंप्रेशन आपके अपने ब्राउज़र के अंदर ही संपन्न होते हैं।'
            : 'AI Photo Lab is built on a fundamental principle: Zero Server Uploads. Utilizing modern HTML5 Canvas and native browser Web APIs, all image compression, resizing, format conversion, and cropping happen locally in your browser memory.'}
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <Lock className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? '100% प्राइवेसी' : '100% Private'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'hi'
                ? 'कोई सर्वर डेटाबेस या क्लाउड स्टोरेज नहीं। आपका डेटा सिर्फ आपका है।'
                : 'Zero cloud database. Your photos never leave your device.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <Zap className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? 'तुरंत परिणाम' : 'Lightning Fast'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'hi'
                ? 'अपलोडिंग और डाउनलोडिंग के इंतजार के बिना सेकंडों में फोटो तैयार।'
                : 'Instant rendering without waiting for multi-megabyte network transfers.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <Award className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              {language === 'hi' ? 'मुफ्त व पारदर्शी' : 'Free & Transparent'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'hi'
                ? 'कोई छुपा हुआ शुल्क नहीं, कोई क्रेडिट लिमिट नहीं, कोई वाटरमार्क नहीं।'
                : 'No hidden paywalls, no credits, no forced watermarks.'}
            </p>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-4">
          {language === 'hi' ? 'द्विभाषी शिक्षा और गाइड' : 'Bilingual Knowledge Commitment'}
        </h2>
        <p>
          {language === 'hi'
            ? 'हम केवल टूल्स ही नहीं प्रदान करते, बल्कि भारतीय छात्रों और सामान्य उपयोगकर्ताओं के लिए हिंदी और अंग्रेजी में विस्तृत ट्यूटोरियल्स भी तैयार करते हैं ताकि वे जान सकें कि DPI क्या होता है, सरकारी फॉर्म में फोटो क्यों रिजेक्ट होती है और WebP फॉर्मेट कैसे काम करता है।'
            : 'In addition to utility tools, we publish in-depth bilingual technical guides in English and Hindi to help users understand image compression algorithms, print DPI calculations, and examination portal guidelines.'}
        </p>
      </div>
    </div>
  );
};
