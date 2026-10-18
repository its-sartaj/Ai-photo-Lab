import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ChevronDown, CheckCircle2, AlertTriangle, FileText, Sparkles, HelpCircle, Table } from 'lucide-react';

export const PassportSeoContent: React.FC = () => {
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const examSpecs = [
    {
      exam: 'SSC (CGL, CHSL, GD, MTS)',
      photoDim: '3.5 cm x 4.5 cm (35 x 45 mm)',
      photoSize: '20 KB to 50 KB',
      sigDim: '4.0 cm x 2.0 cm',
      sigSize: '10 KB to 20 KB',
      bg: 'White or Light Cream',
      notes: 'No caps or spectacles allowed. Recent photo taken within 3 months.'
    },
    {
      exam: 'UPSC (Civil Services, NDA, CDS)',
      photoDim: '350 x 350 to 1000 x 1000 px',
      photoSize: '20 KB to 300 KB',
      sigDim: '350 x 350 to 1000 x 1000 px',
      sigSize: '20 KB to 300 KB',
      bg: 'Pure White Background',
      notes: 'Photo must display candidate name and date of photo taken at bottom.'
    },
    {
      exam: 'IBPS & SBI (Bank PO / Clerk)',
      photoDim: '4.5 cm x 3.5 cm (200 x 230 px)',
      photoSize: '20 KB to 50 KB',
      sigDim: '140 x 60 px (White paper)',
      sigSize: '10 KB to 20 KB',
      bg: 'Light / White Background',
      notes: 'Signature in black ink only. Signature in CAPITAL LETTERS not accepted.'
    },
    {
      exam: 'NEET UG (NTA Medical Entrance)',
      photoDim: '3.5 cm x 4.5 cm (Passport) & 4x6 (Postcard)',
      photoSize: '10 KB to 200 KB',
      sigDim: '4.0 cm x 2.0 cm',
      sigSize: '4 KB to 30 KB',
      bg: 'White Background (80% face)',
      notes: 'Ears must be clearly visible. Candidate name and date imprinted.'
    },
    {
      exam: 'JEE Main (NTA Engineering)',
      photoDim: '3.5 cm x 4.5 cm',
      photoSize: '10 KB to 200 KB',
      sigDim: '3.5 cm x 1.5 cm',
      sigSize: '4 KB to 30 KB',
      bg: 'White Background (80% face coverage)',
      notes: 'Spectacles permitted only if worn regularly. No polarized lenses.'
    },
    {
      exam: 'Driving License (Parivahan Sarathi)',
      photoDim: '35 mm x 45 mm (420 x 525 px @ 300 DPI)',
      photoSize: '10 KB to 20 KB',
      sigDim: '256 x 64 px',
      sigSize: '10 KB to 20 KB',
      bg: 'White or Light Blue',
      notes: 'Frontal face view with neutral expression. JPEG format only.'
    },
    {
      exam: 'PAN Card (NSDL / UTIITSL)',
      photoDim: '3.5 cm x 2.5 cm (200 DPI)',
      photoSize: 'Under 50 KB',
      sigDim: '4.5 cm x 2.0 cm',
      sigSize: 'Under 50 KB',
      bg: 'Plain White Background',
      notes: 'Clear color photograph without shadows. Signature in black or blue ink.'
    }
  ];

  const faqs = [
    {
      qEn: 'Why was my photograph rejected on the SSC or UPSC portal?',
      qHi: 'मेरा फोटो SSC या UPSC पोर्टल पर रिजेक्ट क्यों हो गया?',
      aEn: 'The most frequent rejection causes include: (1) Wearing sunglasses, tinted spectacles, or hats; (2) Background color not being pure white or light grey; (3) File size being under 20KB or over 50KB; (4) Blurry, pixelated camera capture; and (5) Failure to imprint candidate name and date of photo capture when mandated by UPSC. AI Photo Lab ensures 100% compliant dimensions and file sizes.',
      aHi: 'फोटो रिजेक्ट होने के प्रमुख कारण हैं: (1) चश्मा या टोपी पहनना; (2) बैकग्राउंड का सफेद या हल्का न होना; (3) फाइल का साइज 20KB से कम या 50KB से अधिक होना; (4) धुंधली फोटो; और (5) UPSC द्वारा निर्धारित नाम व फोटो की तारीख न लिखा होना। AI Photo Lab इन सभी नियमों का शत-प्रतिशत पालन करता है।'
    },
    {
      qEn: 'What is the standard passport size in centimeters, millimeters, and inches?',
      qHi: 'सेंटीमीटर, मिलीमीटर और इंच में पासपोर्ट साइज का मानक माप क्या है?',
      aEn: 'In India, the United Kingdom, and Schengen nations, standard biometric passport size is 3.5 cm x 4.5 cm (35 mm x 45 mm, or 1.38 x 1.77 inches). At a print resolution of 300 DPI (dots per inch), this corresponds to exactly 413 x 531 pixels. For the United States and Canada, the standard passport photo dimension is 2 x 2 inches (51 mm x 51 mm, or 600 x 600 pixels @ 300 DPI).',
      aHi: 'भारत, यूके और यूरोपीय देशों में पासपोर्ट फोटो का मानक माप 3.5 cm x 4.5 cm (35 mm x 45 mm, या 1.38 x 1.77 इंच) होता है। 300 DPI प्रिंटिंग रेजोल्यूशन पर यह सटीक 413 x 531 पिक्सल होता है। वहीं अमेरिका (US Visa) के लिए 2 x 2 इंच (51 x 51 mm या 600 x 600 पिक्सल) का माप लगता है।'
    },
    {
      qEn: 'How does the 4x6 Printable Grid Sheet generator work?',
      qHi: '4x6 प्रिंटेबल शीट जनरेटर कैसे काम करता है?',
      aEn: 'When you click "Download 4x6 Printable Sheet (8 Photos)", AI Photo Lab creates an uncompressed 1800 x 1200 pixel canvas at 300 DPI (the exact dimensions of standard 4x6 inch photographic paper). It automatically arranges 8 passport photos with thin cutting borders and proper spacing, so you can print them at any studio or home photo printer for under ₹10 instead of paying ₹100+ at photo studios.',
      aHi: 'जब आप "4x6 प्रिंटेबल शीट (8 फोटो)" पर क्लिक करते हैं, तो AI Photo Lab 300 DPI पर 1800 x 1200 पिक्सल का कैनवास बनाता है (जो 4x6 इंच फोटो पेपर का सटीक माप है)। यह 8 पासपोर्ट फोटो को कटिंग बॉर्डर के साथ व्यवस्थित करता है, जिसे आप किसी भी स्टूडियो से मात्र ₹5-10 में प्रिंट करा सकते हैं।'
    },
    {
      qEn: 'How can I ensure my face covers 70% to 80% of the passport photo?',
      qHi: 'पासपोर्ट फोटो में चेहरा 70% से 80% क्षेत्र कवर करे, यह कैसे सुनिश्चित करें?',
      aEn: 'Official government passport and visa standards mandate that the subject’s face—from the bottom of the chin to the top of the forehead—must occupy between 70% and 80% of the total frame height. AI Photo Lab features an interactive "Face Guide" biometric oval overlay that shows you the exact position where your eyes, nose, and chin should align during cropping.',
      aHi: 'सरकारी नियमों के अनुसार ठोड़ी से सिर के ऊपरी भाग तक चेहरा फोटो के कुल भाग का 70% से 80% हिस्सा कवर करना चाहिए। AI Photo Lab में एक इंटरैक्टिव "बायोमेट्रिक फेस गाइड ओवल" दिया गया है, जिससे आप आसानी से अपनी आंखों और चेहरे को सही ग्रिड में संरेखित कर सकते हैं।'
    },
    {
      qEn: 'Is my photograph secure when creating passport photos on AI Photo Lab?',
      qHi: 'क्या AI Photo Lab पर पासपोर्ट फोटो बनाते समय मेरी फोटो सुरक्षित रहती है?',
      aEn: 'Yes, 100% secure. AI Photo Lab executes all background coloring, facial cropping, DPI calculation, and grid sheet generation client-side within your browser’s local JavaScript sandbox. Your raw photos and biometric details are never uploaded to any cloud server or database.',
      aHi: 'हाँ, शत-प्रतिशत सुरक्षित है। AI Photo Lab आपके ब्राउज़र के अंदर ही सभी बैकग्राउंड कलरिंग, क्रॉपिंग और प्रिंटेबल शीट जनरेट करता है। आपकी कोई भी फोटो किसी सर्वर पर अपलोड या सेव नहीं की जाती।'
    }
  ];

  // Schema-ready JSON-LD structured data for Google Rich Results
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
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Guide Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'विस्तृत गाइड और परीक्षा नियम' : 'Complete Guide & Specifications'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi'
            ? 'पासपोर्ट साइज फोटो नियम, परीक्षा विनिर्देश और प्रिंटिंग गाइड'
            : 'Standard Passport Photo Rules, Exam Specifications & Printing Guide'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'सरकारी नौकरी के ऑनलाइन फॉर्म, प्रतियोगी परीक्षाओं (SSC, UPSC, NTA) और वीजा दस्तावेजों के लिए सटीक बायोमेट्रिक पासपोर्ट फोटो तैयार करने की संपूर्ण गाइड।'
            : 'In-depth guide on dimension requirements, aspect ratios, background lighting, and technical specifications for competitive exam portals across India and international visa standards.'}
        </p>
      </div>

      {/* Deep Educational Content (500+ Words) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'बायोमेट्रिक फोटो के 5 स्वर्णिम नियम' : '5 Core Rules for Biometric Photos'}</span>
          </h3>
          <p>
            {language === 'hi'
              ? 'बायोमेट्रिक पासपोर्ट फोटो केवल एक आम सेल्फी नहीं है। इसमें चेहरे का संरेखण, प्रकाश और पृष्ठभूमि का कड़ाई से पालन किया जाना आवश्यक है:'
              : 'Biometric passport photographs must adhere to strict international civil aviation (ICAO) and government recruitment protocols to facilitate facial recognition validation:'}
          </p>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc pl-4">
            <li>
              <strong>{language === 'hi' ? 'चेहरे का अनुपात (70–80%):' : 'Facial Coverage (70–80%):'}</strong>{' '}
              {language === 'hi'
                ? 'फोटो में ठोड़ी से सिर के ऊपरी भाग तक चेहरा फ्रेम का 70% से 80% भाग अवश्य कवर करना चाहिए।'
                : 'The head from the bottom of the chin to the crown must occupy 70% to 80% of the vertical frame.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'सफेद या हल्की पृष्ठभूमि:' : 'Plain Background:'}</strong>{' '}
              {language === 'hi'
                ? 'पृष्ठभूमि एक समान, सादी और सफेद या बहुत हल्के रंग की होनी चाहिए। कोई छाया या पैटर्न नहीं होना चाहिए।'
                : 'Backdrop must be uniform, neutral white, off-white, or light blue without patterns or background shadows.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'तटस्थ चेहरे का भाव:' : 'Neutral Expression:'}</strong>{' '}
              {language === 'hi'
                ? 'मुंह बंद रखें, दोनों आंखें खुली और सीधे कैमरे की ओर केंद्रित होनी चाहिए। मुस्कुराना या भौंहें सिकोड़ना मना है।'
                : 'Maintain a natural frontal pose with both eyes open, looking directly into the lens with mouth closed.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'चश्मा और टोपी नियम:' : 'Headgear & Eyewear:'}</strong>{' '}
              {language === 'hi'
                ? 'टोपी, धूप का चश्मा या रंगीन लेंस पूरी तरह प्रतिबंधित हैं। धार्मिक पगड़ी की अनुमति है यदि चेहरा पूरी तरह दृश्यमान हो।'
                : 'Sunglasses and tinted lenses are strictly forbidden. Religious headgear is permitted provided facial features remain unobstructed.'}
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>{language === 'hi' ? 'चरण-दर-चरण ट्यूटोरियल: फोटो कैसे बनाएं' : 'Step-by-Step Usage Tutorial'}</span>
          </h3>
          <ol className="space-y-3 text-xs md:text-sm text-slate-600 list-decimal pl-4">
            <li>
              <strong>{language === 'hi' ? 'फोटो अपलोड करें:' : 'Select Your Photo:'}</strong>{' '}
              {language === 'hi'
                ? 'अपने फोन या कंप्यूटर से कोई भी स्पष्ट, सामने से ली गई तस्वीर ड्रैग एंड ड्रॉप करें या फाइल चुनें।'
                : 'Drag and drop any well-lit frontal portrait from your phone or PC into the secure browser dropzone.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'प्रीसेट व पृष्ठभूमि चुनें:' : 'Choose Exam Preset & Background:'}</strong>{' '}
              {language === 'hi'
                ? 'SSC, UPSC, IBPS या 3.5x4.5 cm प्रीसेट पर क्लिक करें। आवश्यकतानुसार बैकग्राउंड कलर (सफेद, नीला, ग्रे) चुनें।'
                : 'Click your target exam preset (e.g. SSC, UPSC, or Indian Passport). Choose a studio background color (White, Blue, Grey).'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'चेहरा संरेखित करें (Face Guide):' : 'Align with Biometric Guide:'}</strong>{' '}
              {language === 'hi'
                ? 'बायोमेट्रिक ओवल गाइड के अंदर अपनी आंखों और ठोड़ी को सही स्थिति में लाने के लिए फोटो को ज़ूम व पैन करें।'
                : 'Utilize the interactive biometric oval overlay to align your eyes, nose, and chin perfectly within the frame.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'सिंगल या 4x6 शीट डाउनलोड करें:' : 'Download Single Photo or 4x6 Sheet:'}</strong>{' '}
              {language === 'hi'
                ? 'ऑनलाइन फॉर्म के लिए सिंगल फोटो (20KB–50KB) डाउनलोड करें या प्रिंट कराने के लिए 8 फोटो वाली 4x6 शीट प्राप्त करें।'
                : 'Download individual compliant JPGs (under 50KB) for portal upload, or export the 8-photo 4x6 printable grid sheet.'}
            </li>
          </ol>
        </div>
      </div>

      {/* Specification Table for Major Exams */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-10 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Table className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-900 text-base md:text-lg">
            {language === 'hi'
              ? 'प्रमुख भारतीय भर्ती परीक्षाओं व दस्तावेजों के आधिकारिक विनिर्देश'
              : 'Official Photo & Signature Specifications for Major Indian Exams'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Examination / Document</th>
                <th className="p-3">Photo Dimensions</th>
                <th className="p-3">Photo KB Size</th>
                <th className="p-3">Signature Dimensions</th>
                <th className="p-3">Signature KB Size</th>
                <th className="p-3">Background</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {examSpecs.map((row, idx) => (
                <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">{row.exam}</td>
                  <td className="p-3 font-mono text-[11px] text-purple-700">{row.photoDim}</td>
                  <td className="p-3 font-semibold text-emerald-700">{row.photoSize}</td>
                  <td className="p-3 font-mono text-[11px]">{row.sigDim}</td>
                  <td className="p-3">{row.sigSize}</td>
                  <td className="p-3">{row.bg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-900 text-lg md:text-xl">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions)' : 'Frequently Asked Questions (FAQs)'}
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm md:text-base text-slate-800 hover:text-purple-700 transition-colors gap-4 cursor-pointer"
                >
                  <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs md:text-sm text-slate-600 leading-relaxed pr-6">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
