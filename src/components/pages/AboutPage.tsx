import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Cpu, Zap, Lock, Heart, Award, CheckCircle2, Code2, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 text-purple-600" />
          <span>{language === 'hi' ? 'हमारा मिशन और विज़न' : 'Our Mission & Vision'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'AI Photo Lab के बारे में' : 'About AI Photo Lab'}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          {language === 'hi'
            ? 'सुरक्षित, निजी, स्वचालित और सुपर-फास्ट वेब टूल्स को हर छात्र, प्रतियोगी उम्मीदवार और पेशेवर तक मुफ्त पहुंचाना।'
            : 'Delivering secure, 100% private, automated, and ultra-fast media tools to students, exam applicants, and creators worldwide.'}
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
        {/* Section 1: The Origin & Problem */}
        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            {language === 'hi' ? '1. हमने AI Photo Lab क्यों बनाया?' : '1. Why We Built AI Photo Lab'}
          </h2>
          <p>
            {language === 'hi'
              ? 'लाखों भारतीय छात्र और नौकरी के आकांक्षी हर साल SSC, UPSC, IBPS, Railways और राज्य स्तरीय परीक्षाओं के लिए ऑनलाइन आवेदन करते हैं। इन सभी पोर्टल्स पर फोटो और सिग्नेचर के लिए बहुत सख्त नियम होते हैं—जैसे फाइल का आकार अनिवार्य रूप से 20KB से 50KB के बीच होना चाहिए और निश्चित सेंटीमीटर (3.5 × 4.5 cm) में होना चाहिए।'
              : 'Every year, millions of students and candidates apply for competitive examinations such as SSC, UPSC, IBPS, NEET, and Railways. Every single application portal enforces stringent, non-negotiable file constraints—such as requiring digital passport photographs between 20KB and 50KB with exact 3.5cm x 4.5cm dimensions.'}
          </p>
          <p>
            {language === 'hi'
              ? 'पारंपरिक ऑनलाइन टूल्स उपयोगकर्ताओं की निजी तस्वीरों को अज्ञात क्लाउड सर्वरों पर अपलोड करते हैं, जो भारी प्राइवेसी खतरा पैदा करता है। इसके अलावा, धीमी इंटरनेट स्पीड पर बड़ी फाइलों को अपलोड और डाउनलोड करने में काफी समय बर्बाद होता है। AI Photo Lab को इसी समस्या को 100% क्लाइंट-साइड हल करने के लिए बनाया गया है।'
              : 'Traditional online converters force users to upload sensitive personal photos, identity cards, and academic documents to remote servers—exposing them to severe data privacy vulnerabilities. Furthermore, uploading high-resolution camera photos on spotty mobile networks creates frustrating upload/download latency. AI Photo Lab was engineered to solve this entirely inside the browser.'}
          </p>
        </section>

        {/* Section 2: How Our Automated Tools Work */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-600" />
            <span>
              {language === 'hi'
                ? '2. हमारे स्वचालित टूल्स कैसे काम करते हैं? (Technology Architecture)'
                : '2. How Our Automated Tools Work (Under the Hood)'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab अत्याधुनिक ब्राउज़र वेब तकनीकों (HTML5 Canvas API, WebAssembly, OffscreenCanvas, और IndexedDB) पर चलता है:'
              : 'AI Photo Lab leverages modern client-side web standards, including the HTML5 Canvas API, WebAssembly (Wasm), OffscreenCanvas, and native WebCodecs:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Code2 className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'अनुकूली बाइनरी सर्च कंप्रेशन' : 'Adaptive Binary Search Compression'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'जब आप 20KB या 50KB चुनते हैं, तो हमारा एल्गोरिद्म मिलीसेकंड्स में कई क्वालिटी आइटरेशन्स चलाकर अधिकतम स्पष्टता और सटीक लक्ष्य आकार सुनिश्चित करता है।'
                  : 'When you select target 20KB or 50KB, our iterative binary search algorithm calculates optimal JPEG/WebP quantization tables in milliseconds to maximize visual fidelity while strictly staying below threshold.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'जीरो सर्वर डेटा ट्रांसफर' : 'Zero Network Transfer'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'आपकी तस्वीरें आपके डिवाइस की RAM में प्रोसेस होती हैं और डिस्कनेक्टेड ऑफलाइन मोड में भी पूरी तरह काम करती हैं।'
                  : 'Raw image pixels reside strictly in local volatile memory. No image payloads or video chunks ever traverse the network, eliminating bandwidth consumption and leak risks.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: User Productivity & Speed Priority */}
        <section className="space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <span>
              {language === 'hi'
                ? '3. उपयोगकर्ता उत्पादकता और गति हमारी सर्वोच्च प्राथमिकता क्यों है?'
                : '3. Why User Productivity & Speed Are Our Priority'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम मानते हैं कि बुनियादी फोटो एडिटिंग के लिए किसी को जटिल सॉफ्टवेयर (जैसे Photoshop) सीखने या भारी शुल्क चुकाने की आवश्यकता नहीं होनी चाहिए। हमारा इंटरफेस "1-क्लिक प्रीसेट" के सिद्धांत पर काम करता है:'
              : 'We believe candidates and creators should never have to grapple with bloated desktop software (like Photoshop) or pay extortionate fees at cyber cafes just to resize an exam photograph. Our user interface is designed around 1-click productivity:'}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm pt-1">
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'hi' ? 'पूर्व-कॉन्फ़िगर किए गए प्रीसेट्स:' : 'Pre-Engineered Exam Presets:'}</strong>{' '}
                {language === 'hi' ? 'SSC, UPSC, NTA, IBPS के लिए सटीक आकार पहले से सेट।' : 'One-click selection for SSC, UPSC, IBPS, and driving licenses.'}
              </span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'hi' ? '4x6 प्रिंटेबल शीट जनरेटर:' : '4x6 Printable Grid Sheet:'}</strong>{' '}
                {language === 'hi' ? 'एक क्लिक में 8 पासपोर्ट फोटो की प्रिंटेबल शीट तैयार।' : 'Generate 8-photo studio-quality grid sheets ready for photo paper printing.'}
              </span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'hi' ? 'रियल-टाइम लाइव प्रीव्यू:' : 'Instant Visual Feedback:'}</strong>{' '}
                {language === 'hi' ? 'डाउनलोड करने से पहले परिणाम और सटीक KB आकार तुरंत देखें।' : 'Inspect resulting KB size and visual quality with zero wait time.'}
              </span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'hi' ? '100% मुफ्त व असीमित:' : 'Forever Free & Watermark-Free:'}</strong>{' '}
                {language === 'hi' ? 'कोई वॉटरमार्क नहीं, कोई अकाउंट लॉगिन अनिवार्य नहीं।' : 'No registrations, no subscriptions, no forced branding watermarks.'}
              </span>
            </li>
          </ul>
        </section>

        {/* Section 4: Bilingual Educational Commitment */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>
              {language === 'hi' ? '4. द्विभाषी शिक्षा और पारदर्शी मार्गदर्शन' : '4. Bilingual Knowledge Commitment'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम केवल टूल्स ही नहीं प्रदान करते, बल्कि भारतीय छात्रों और सामान्य उपयोगकर्ताओं के लिए हिंदी और अंग्रेजी दोनों भाषाओं में विस्तृत ट्यूटोरियल्स और गाइड्स तैयार करते हैं। हमारा उद्देश्य डिजिटल साक्षरता को बढ़ावा देना और हर नागरिक को सशक्त बनाना है।'
              : 'Alongside automated utility tools, we publish comprehensive bilingual technical guides in English and Hindi covering print DPI mechanics, aspect ratio preservation, video bitrate optimization, and rejection prevention on major government portals.'}
          </p>
        </section>
      </div>
    </div>
  );
};
