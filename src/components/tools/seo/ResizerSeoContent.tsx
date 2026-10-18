import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ChevronDown, CheckCircle2, Lock, Sliders, Sparkles, HelpCircle, Ruler } from 'lucide-react';

export const ResizerSeoContent: React.FC = () => {
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqs = [
    {
      qEn: 'What is the mathematical difference between Pixels, Centimeters, and Inches in digital photos?',
      qHi: 'डिजिटल फोटो में पिक्सल, सेंटीमीटर और इंच में गणितीय अंतर क्या है?',
      aEn: 'Pixels represent the physical grid of light-emitting picture elements on digital screens (e.g. 1920x1080 px). Centimeters (cm) and Inches (in) describe physical print dimensions. The conversion between them depends entirely on DPI (Dots Per Inch). The formula is: Pixels = (Inches × DPI) or Pixels = (Centimeters / 2.54) × DPI. At standard 300 DPI photo print resolution, 1 inch equals exactly 300 pixels, and 1 centimeter equals approximately 118.11 pixels.',
      aHi: 'पिक्सल स्क्रीन पर दिखने वाले बिंदुओं की संख्या होती है (जैसे 1920x1080)। वहीं सेंटीमीटर और इंच प्रिंटिंग का भौतिक माप होते हैं। दोनों के बीच रूपांतरण DPI (डॉट्स प्रति इंच) पर निर्भर करता है। इसका सूत्र है: Pixels = (Inches × DPI)। 300 DPI प्रिंटिंग पर 1 इंच में 300 पिक्सल होते हैं, और 1 सेमी में लगभग 118 पिक्सल होते हैं।'
    },
    {
      qEn: 'Why is Aspect Ratio Lock crucial when resizing photographs?',
      qHi: 'फोटो रीसाइज करते समय आस्पेक्ट रेश्यो लॉक (Aspect Ratio Lock) क्यों जरूरी है?',
      aEn: 'Aspect ratio is the proportional relationship between an image’s width and height (such as 1:1 square, 4:5 portrait, or 16:9 widescreen). When the aspect ratio lock is enabled, changing the width automatically recalculates the height proportionally. If you disable the aspect ratio lock, faces and objects will stretch, distort, flatten, or elongate unnaturally—causing instant rejection on official exam portals.',
      aHi: 'आस्पेक्ट रेश्यो फोटो की चौड़ाई और ऊंचाई का आनुपातिक संबंध होता है (जैसे 1:1, 4:5, 16:9)। रेश्यो लॉक ऑन रहने पर चौड़ाई बदलने पर ऊंचाई अपने आप संतुलित अनुपात में बदल जाती है। अगर रेश्यो लॉक न हो, तो फोटो खिंचकर या दबकर विकृत हो जाती है, जिससे सरकारी फॉर्म में फोटो रिजेक्ट हो जाती है।'
    },
    {
      qEn: 'How can I resize an image to exact KB size without visual blur or pixelation?',
      qHi: 'फोटो की स्पष्टता खोए बिना उसे सटीक KB आकार में कैसे रीसाइज करें?',
      aEn: 'AI Photo Lab uses a dual-pass optimization technique. First, it resizes the pixel matrix using bicubic interpolation downsampling to remove excessive redundant pixels (e.g., shrinking a 4000x3000 camera photo down to 800x600 px). Second, it dynamically tunes JPEG quantization chroma-subsampling so that compression artifacts remain imperceptible to the human eye while reaching exact file weight targets like under 50KB or 20KB.',
      aHi: 'AI Photo Lab डुअल-पास तकनीक का उपयोग करता है। सबसे पहले, यह 4000x3000 जैसे भारी कैमरा फोटो के अनावश्यक पिक्सल को बाईक्यूबिक इंटरपोलेशन से संतुलित करता है। इसके बाद, यह जेपीईजी क्वांटाइजेशन को समायोजित करके फोटो की शार्पनेस बरकरार रखते हुए साइज को 20KB या 50KB तक ले आता है।'
    },
    {
      qEn: 'Does resizing my photo on AI Photo Lab upload my files to any external server?',
      qHi: 'क्या AI Photo Lab पर फोटो रीसाइज करते समय मेरी फाइल किसी सर्वर पर अपलोड होती है?',
      aEn: 'Never. All dimension recalculations, canvas pixel sampling, and format exports run completely in your local browser runtime via the HTML5 2D Canvas API. Your photos remain 100% confidential and never transmit over the network.',
      aHi: 'बिल्कुल नहीं। सभी पिक्सल रीसाइजिंग और गणनाएं आपके ब्राउज़र के अंदर ही होती हैं। आपकी तस्वीरें 100% निजी और सुरक्षित रहती हैं।'
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

      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2">
          <Ruler className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'रीसाइजिंग और माप गाइड' : 'Image Dimensions & Scale Masterclass'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi'
            ? 'फोटो रीसाइजिंग, पिक्सल बनाम सेंटीमीटर (cm/mm/in) और आस्पेक्ट रेश्यो गाइड'
            : 'Image Resizing, Aspect Ratio Locks & Dimensional Mathematics'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'समझें कि पिक्सल, सेंटीमीटर और इंच कैसे आपस में परिवर्तित होते हैं, और कैसे अपनी तस्वीरों का आकार बिना क्वालिटी खोए बिल्कुल सटीक करें।'
            : 'Master the principles of pixel density, aspect ratio preservation, unit conversions across screen and print media, and targeted file size compression without visual artifacts.'}
        </p>
      </div>

      {/* Deep Educational Guide (500+ Words) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>{language === 'hi' ? 'पिक्सल, सेंटीमीटर और इंच का विज्ञान' : 'The Science of Pixels, CM & DPI'}</span>
          </h3>
          <p>
            {language === 'hi'
              ? 'डिजिटल दुनिया और भौतिक प्रिंटिंग की दुनिया के बीच की मुख्य कड़ी DPI (डॉट्स प्रति इंच) होती है। अधिकांश कंप्यूटर और मोबाइल स्क्रीन 72 से 96 DPI पर काम करते हैं, जबकि आधिकारिक दस्तावेज और पासपोर्ट फोटो 300 DPI पर प्रिंट किए जाते हैं।'
              : 'DPI (Dots Per Inch) serves as the bridge between digital displays and physical print paper. Screen graphics render comfortably at 72–96 DPI, whereas legal identity documents, certificates, and exam submission sheets require 300 DPI for razor-sharp clarity.'}
          </p>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc pl-4">
            <li>
              <strong>3.5 cm x 4.5 cm @ 300 DPI:</strong> 413 px x 531 px (Standard India / UK Passport photo).
            </li>
            <li>
              <strong>2.0 in x 2.0 in @ 300 DPI:</strong> 600 px x 600 px (US / Canada Visa format).
            </li>
            <li>
              <strong>4.0 cm x 2.0 cm @ 200 DPI:</strong> 315 px x 157 px (Official SSC / Bank signature requirement).
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'आस्पेक्ट रेश्यो और क्वालिटी सुरक्षा' : 'Aspect Ratio & Visual Quality Safeguards'}</span>
          </h3>
          <p>
            {language === 'hi'
              ? 'आस्पेक्ट रेश्यो लॉक एक सुरक्षा कवच की तरह है। यदि आप इसे अक्षम करके फोटो को 500x200 पिक्सल में बदलेंगे, तो चेहरा खिंचकर विकृत हो जाएगा। AI Photo Lab आपको px, cm, mm और inches में तुरंत रीसाइज करने की सुविधा देता है और लाइव पिक्सल इक्विवेलेंट प्रदर्शित करता है।'
              : 'When shrinking modern smartphone camera photos (often 12MP to 50MP weighing 5MB to 15MB) down to portal requirements like 50KB, naive tools produce severe pixelation and blocky compression artifacts. AI Photo Lab maintains high-frequency edge detail with smooth downsampling interpolation.'}
          </p>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900">
            <strong>Pro Tip:</strong> Always keep the aspect ratio padlock locked unless an exam authority explicitly mandates custom non-proportional dimensions.
          </div>
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
