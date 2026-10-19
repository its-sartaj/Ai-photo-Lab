import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ChevronDown, CheckCircle2, Sliders, Sparkles, HelpCircle, Table, ShieldCheck, Zap, FileText } from 'lucide-react';

export const CompressorSeoContent: React.FC = () => {
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const examSpecs = [
    {
      portal: 'SSC (CGL, CHSL, MTS, GD Constable)',
      targetPhoto: '20 KB to 50 KB',
      format: 'JPEG / JPG',
      dimensions: '3.5 cm x 4.5 cm (100 x 120 to 200 x 230 px)',
      sigSize: '10 KB to 20 KB (4.0 x 2.0 cm)',
      notesEn: 'White or off-white background. No caps, dark goggles, or headgear covering forehead.',
      notesHi: 'सफेद या हल्का बैकग्राउंड। चश्मा या टोपी पहनकर खिंचवाई गई फोटो रिजेक्ट हो जाती है।'
    },
    {
      portal: 'UPSC (Civil Services, CDS, NDA, CAPF)',
      targetPhoto: '20 KB to 300 KB',
      format: 'JPG only',
      dimensions: '350 x 350 to 1000 x 1000 px',
      sigSize: '20 KB to 300 KB (Same dimensions)',
      notesEn: 'Candidate full name and date of photograph must appear imprinted at the bottom.',
      notesHi: 'फोटो के नीचे उम्मीदवार का पूरा नाम और फोटो खींचने की तारीख छपी होनी अनिवार्य है।'
    },
    {
      portal: 'IBPS & SBI (PO, Clerk, SO)',
      targetPhoto: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      dimensions: '200 x 230 pixels (4.5 x 3.5 cm)',
      sigSize: '10 KB to 20 KB (140 x 60 pixels, black ink)',
      notesEn: 'Signature must not be in ALL CAPITAL letters. Light or white background required.',
      notesHi: 'हस्ताक्षर केवल काली स्याही से होना चाहिए। कैपिटल अक्षरों में किया गया सिग्नेचर अमान्य है।'
    },
    {
      portal: 'NTA (NEET UG & JEE Main)',
      targetPhoto: '10 KB to 200 KB',
      format: 'JPG / JPEG',
      dimensions: 'Passport (3.5 x 4.5 cm) & Postcard (4 x 6 inch)',
      sigSize: '4 KB to 30 KB (White background)',
      notesEn: '80% face coverage without mask. Both ears and eyes must be clearly visible.',
      notesHi: '80% चेहरा दिखना चाहिए। दोनों कान साफ नजर आने चाहिए और बैकग्राउंड सफेद होना चाहिए।'
    },
    {
      portal: 'Railway RRB (NTPC, ALP, Group D)',
      targetPhoto: '20 KB to 50 KB',
      format: 'JPG / JPEG',
      dimensions: '35 mm x 45 mm',
      sigSize: '10 KB to 40 KB (Blue or black ink)',
      notesEn: 'Color photograph taken with clear front view. Blurry or selfie photos get rejected.',
      notesHi: 'सामने से ली गई स्पष्ट रंगीन फोटो। सेल्फी या तिरछी फोटो तुरंत रिजेक्ट हो जाती है।'
    }
  ];

  const faqs = [
    {
      qEn: 'How does AI Photo Lab compress images to 20KB or 50KB without making them blurry?',
      qHi: 'AI Photo Lab फोटो को धुंधला किए बिना 20KB या 50KB में कैसे कंप्रेस करता है?',
      aEn: 'Traditional tools apply uniform brutal downscaling that blurs fine facial details. AI Photo Lab utilizes an adaptive dual-pass engine. First, it scales excessive megapixel dimensions (e.g. from 4000x3000 to standard 800x600 px) using bicubic interpolation. Second, it runs a localized binary-search algorithm over standard JPEG quantization matrices to eliminate high-frequency redundant background noise while preserving sharp edges around eyes, nose, facial borders, and signatures.',
      aHi: 'पारंपरिक टूल्स फोटो के पिक्सल बहुत ज्यादा घटा देते हैं जिससे चेहरा धुंधला हो जाता है। AI Photo Lab डुअल-पास तकनीक का उपयोग करता है। पहले यह अनावश्यक पिक्सल को संतुलित करता है, फिर बाइनरी-सर्च एल्गोरिद्म से बैकग्राउंड का फालतू डेटा हटाकर चेहरे, आंखों और सिग्नेचर की शार्पनेस को बिल्कुल सुरक्षित रखता है।'
    },
    {
      qEn: 'Why do government recruitment portals strictly enforce 20KB to 50KB file size limits?',
      qHi: 'सरकारी परीक्षा पोर्टलों पर 20KB से 50KB का सख्त नियम क्यों होता है?',
      aEn: 'Recruitment commissions like SSC and UPSC receive between 3 million to 10 million online applications per exam cycle. Storing, verifying, and generating admit cards with high-resolution 5MB photos would strain government database servers and cause portal timeouts. Enforcing a 20KB–50KB limit ensures rapid server uploads, seamless offline biometric verification at exam centers, and instant PDF admit card printing.',
      aHi: 'SSC और UPSC जैसी परीक्षाओं में 30 से 50 लाख उम्मीदवार आवेदन करते हैं। अगर सभी 5MB की फोटो अपलोड करेंगे तो सर्वर क्रैश हो जाएंगे। 20KB-50KB की फोटो से एडमिट कार्ड तुरंत जनरेट होते हैं और परीक्षा केंद्र पर बायोमेट्रिक जांच तेजी से होती है।'
    },
    {
      qEn: 'Which format is best for compressing official photos: JPG, PNG, or WebP?',
      qHi: 'सरकारी फॉर्म फोटो के लिए कौन सा फॉर्मेट सबसे अच्छा है: JPG, PNG या WebP?',
      aEn: 'For official government portals (SSC, UPSC, NEET, Police, Banks), JPEG/JPG is universally mandatory. While WebP offers superior web compression and PNG preserves lossless graphics, government upload forms will reject .webp or .png extensions with "Invalid File Type" errors. Always choose JPG for exam forms. For personal websites or blogs, WebP is recommended.',
      aHi: 'सरकारी फॉर्म (SSC, UPSC, NEET, रेलवे) के लिए केवल JPG/JPEG मान्य होता है। WebP और PNG आधुनिक फॉर्मेट हैं लेकिन सरकारी पोर्टल इन्हें स्वीकार नहीं करते और एरर दिखाते हैं। इसलिए सरकारी फॉर्म के लिए हमेशा JPG फॉर्मेट ही चुनें।'
    },
    {
      qEn: 'Is my photograph uploaded to any server or database during compression?',
      qHi: 'क्या कंप्रेस करते समय मेरी फोटो किसी सर्वर या डेटाबेस पर अपलोड होती है?',
      aEn: 'Never. AI Photo Lab is built on 100% client-side HTML5 Canvas and WebAssembly architecture. Every byte of image data is loaded into your browser’s local sandboxed memory and processed by your device’s GPU/CPU. No images, signatures, or metadata are ever transmitted over the network or saved to any cloud storage.',
      aHi: 'बिल्कुल नहीं। AI Photo Lab 100% क्लाइंट-साइड HTML5 Canvas तकनीक पर आधारित है। आपकी फोटो आपके फोन या कंप्यूटर की रैम में ही प्रोसेस होती है। कोई भी फोटो या सिग्नेचर कभी किसी बाहरी सर्वर पर अपलोड या स्टोर नहीं किया जाता।'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.qEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.aEn
      }
    }))
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 mt-12 border-t border-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Guide Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sliders className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'गहन फोटो कंप्रेशन गाइड' : 'Complete Photo Compression Guide'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi'
            ? 'फोटो का साइज 20KB, 50KB और 100KB में कैसे कम करें (बिना धुंधला किए)'
            : 'How to Compress Photos to 20KB, 50KB & 100KB Online Without Quality Loss'}
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'सरकारी नौकरी के फॉर्म (SSC, UPSC, रेलवे, पुलिस, बैंक) और कॉलेज प्रवेश पोर्टल्स पर आवेदन करते समय फोटो का साइज 20KB से 50KB के बीच रखना अनिवार्य होता है। यहां जानिए कि बिना फोटो की क्वालिटी और स्पष्टता खोए उसका साइज कैसे कम किया जाता है।'
            : 'Whether you are submitting an online application for SSC CGL, UPSC Civil Services, IBPS Bank PO, or NEET UG—exceeding file thresholds or uploading distorted images causes immediate application rejection. Learn the exact technical specifications and how our on-device engine compresses images to precise KB targets.'}
        </p>
      </div>

      {/* Core Technical Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {language === 'hi' ? '1. बाइनरी सर्च क्वांटाइजेशन' : '1. Iterative Binary Quantization'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'हमारा इंजन बार-बार कंप्रेशन ट्रायल्स को मिलीसेकंड्स में रन करता है, जिससे फोटो ठीक 48KB या 19KB पर रुकती है ताकि 50KB/20KB की सीमा सुरक्षित रहे।'
              : 'Our binary search loop rapidly tests quality compression tables in milliseconds to guarantee your file lands safely under 50KB or 20KB with zero manual guesswork.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {language === 'hi' ? '2. चेहरे की स्पष्टता सुरक्षित' : '2. Facial Edge Preservation'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'आंखों, नाक, होंठ और हस्ताक्षर के किनारों को संरक्षित रखते हुए केवल बैकग्राउंड के फालतू पिक्सल डेटा को कंप्रेस किया जाता है।'
              : 'High-contrast edge algorithms preserve critical facial biometrics and handwritten signature lines while aggressively quantizing flat background areas.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {language === 'hi' ? '3. शत-प्रतिशत गोपनीयता' : '3. 100% Client-Side Privacy'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'आपकी निजी तस्वीरें और आईडी कभी किसी सर्वर पर नहीं भेजी जातीं। सब कुछ आपके ब्राउज़र की रैम में ही होता है।'
              : 'No external network requests, no remote server storage, and no tracking. Your private identity photos never leave your device.'}
          </p>
        </div>
      </div>

      {/* Sarkari Exam Specifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-1">
              <Table className="w-4 h-4" />
              <span>{language === 'hi' ? 'सरकारी परीक्षा मानक' : 'Official Recruitment Specs'}</span>
            </div>
            <h3 className="text-lg font-bold">
              {language === 'hi'
                ? 'प्रमुख भर्ती परीक्षाओं के लिए फोटो व सिग्नेचर साइज टेबल'
                : 'Major Indian Competitive Exam Photo & Signature Size Specifications'}
            </h3>
          </div>
          <span className="text-xs bg-purple-900/80 text-purple-200 px-3 py-1.5 rounded-lg border border-purple-700/50 self-start sm:self-auto">
            {language === 'hi' ? 'अद्यतित मानक' : 'Verified Limits'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{language === 'hi' ? 'परीक्षा / पोर्टल' : 'Exam / Portal'}</th>
                <th className="py-3.5 px-4">{language === 'hi' ? 'फोटो साइज (KB)' : 'Photo KB Limit'}</th>
                <th className="py-3.5 px-4">{language === 'hi' ? 'आयाम / माप' : 'Dimensions'}</th>
                <th className="py-3.5 px-4">{language === 'hi' ? 'हस्ताक्षर (Signature)' : 'Signature Limit'}</th>
                <th className="py-3.5 px-4 min-w-[200px]">{language === 'hi' ? 'विशेष निर्देश' : 'Mandatory Guidelines'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {examSpecs.map((spec, i) => (
                <tr key={i} className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{spec.portal}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {spec.targetPhoto}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-purple-700 font-semibold">{spec.dimensions}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{spec.sigSize}</td>
                  <td className="py-3.5 px-4 text-slate-500 leading-relaxed">
                    {language === 'hi' ? spec.notesHi : spec.notesEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-Step Tutorial */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 mb-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            {language === 'hi'
              ? 'फोटो कंप्रेस करने के 4 आसान स्टेप्स:'
              : 'Step-by-Step: Compressing Photos with AI Photo Lab'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'फोटो अपलोड करें' : 'Select Photo'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'अपने मोबाइल या कंप्यूटर से JPG, PNG या WebP फोटो ड्रॉपज़ोन में चुनें।'
                : 'Upload or drag and drop your JPG, PNG, or WebP photo into the secure workspace.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'टारगेट साइज चुनें' : 'Choose Target Size'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'त्वरित बटन "20 KB", "50 KB" या "100 KB" पर क्लिक करें या स्लाइडर से एडजस्ट करें।'
                : 'Click quick presets like "20 KB", "50 KB", or slide the quality bar to match your portal rules.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'लाइव प्रीव्यू देखें' : 'Instant Preview'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'स्क्रीन पर वास्तविक फाइल साइज और फोटो की स्पष्टता को लाइव देखकर संतुष्ट हों।'
                : 'Inspect the live output dimensions and real-time compressed file weight side by side.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'तुरंत डाउनलोड' : 'Instant Download'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'डाउनलोड बटन पर क्लिक करें। आपकी कंप्रेस की गई फोटो बिना वॉटरमार्क तुरंत सेव हो जाएगी।'
                : 'Click Download to instantly save your high-clarity photo ready for direct portal submission.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions (Photo Compression FAQs)'}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-purple-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base">
                    {language === 'hi' ? faq.qHi : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-purple-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
