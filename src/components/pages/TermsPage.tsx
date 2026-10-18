import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { FileText, CheckCircle2, ShieldAlert, Scale, AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'नियम व शर्तें (Terms of Service)' : 'Terms of Service'}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          {language === 'hi'
            ? 'अंतिम संशोधन: हालिया • उचित उपयोग और सेवा समझौता'
            : 'Last Updated: Recent • Fair Use & Terms Agreement'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
        {/* Section 1: Acceptance */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <span>{language === 'hi' ? '1. सेवा शर्तों की स्वीकृति (Acceptance of Terms)' : '1. Acceptance of Terms'}</span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab (aiphotolab.publicvm.com) की वेबसाइट, टूल्स या संबंधित सामग्री का उपयोग करके, आप इन नियमों व शर्तों से पूर्णतः बंधे होने की सहमति देते हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।'
              : 'By accessing or utilizing AI Photo Lab tools, web applications, and bilingual tutorials, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue using our services.'}
          </p>
        </section>

        {/* Section 2: Fair Use Policy & Acceptable File Uploads */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <span>{language === 'hi' ? '2. उचित उपयोग नीति और स्वीकार्य फाइलें (Fair Use Policy)' : '2. Fair Use & Acceptable File Uploads'}</span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab केवल कानूनी और वैध व्यक्तिगत या व्यावसायिक उपयोग के लिए है। उपयोगकर्ता निम्नलिखित शर्तों का पालन करने के लिए बाध्य हैं:'
              : 'AI Photo Lab is designed for lawful personal, educational, and professional productivity. You agree to adhere to the following acceptable use standards:'}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-slate-600">
            <li>
              <strong>{language === 'hi' ? 'स्वीकार्य फाइल प्रारूप:' : 'Acceptable Formats:'}</strong>{' '}
              {language === 'hi'
                ? 'हमारे टूल्स सामान्य इमेज (JPG, PNG, WebP, SVG, BMP, ICO) और वीडियो (MP4, WebM) प्रारूपों का समर्थन करते हैं। किसी भी निष्पादन योग्य (executable .exe, .sh), स्क्रिप्टिंग या दुर्भावनापूर्ण फाइल को प्रोसेस करने का प्रयास पूर्णतः प्रतिबंधित है।'
                : 'Our tools process standard digital image formats (JPG, JPEG, PNG, WebP, SVG, BMP, ICO) and standard video containers (MP4, WebM). Attempting to inject executable code, malware, or malicious script payloads is strictly prohibited.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'प्रतिबंधित सामग्री:' : 'Prohibited Content:'}</strong>{' '}
              {language === 'hi'
                ? 'आप ऐसी किसी भी सामग्री को प्रोसेस करने के लिए हमारे टूल्स का उपयोग नहीं करेंगे जो अवैध, मानहानिकारक, अश्लील, कॉपीराइट उल्लंघनकारी, या किसी व्यक्ति के निजता अधिकारों का हनन करती हो।'
                : 'You may not utilize our platform to manipulate, generate, or format unlawful, defamatory, infringing, fraudulent, or harassing media.'}
            </li>
            <li>
              <strong>{language === 'hi' ? 'ऑटोमेशन व स्क्रैपिंग:' : 'Automated Abuse:'}</strong>{' '}
              {language === 'hi'
                ? 'वेबसाइट पर अत्यधिक लोड डालने या सेवा में बाधा उत्पन्न करने वाले स्वचालित बॉट, डीडीओएस टूल्स या अनाधिकृत स्क्रैपर चलाना वर्जित है।'
                : 'Automated scraping, denial-of-service attempts, or exploiting browser concurrency to disrupt infrastructure availability is prohibited.'}
            </li>
          </ul>
        </section>

        {/* Section 3: Intellectual Property & Copyright Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '3. बौद्धिक संपदा और आपकी तस्वीरों का स्वामित्व'
                : '3. Intellectual Property & Your Image Ownership'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab आपकी किसी भी फोटो, इमेज या वीडियो पर कोई स्वामित्व या कॉपीराइट का दावा नहीं करता है। आपके द्वारा बनाई गई सभी तस्वीरों का संपूर्ण बौद्धिक संपदा अधिकार पूरी तरह से केवल आपके पास रहता है।'
              : 'AI Photo Lab claims absolutely zero ownership, copyright, or intellectual property rights over any images, graphics, or videos you import or process. All rights remain exclusively with you or the original lawful copyright owner.'}
          </p>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab का ब्रांड नाम, लोगो, सोर्स कोड, यूजर इंटरफेस डिज़ाइन और द्विभाषी ट्यूटोरियल्स AI Photo Lab के स्वामियों की बौद्धिक संपदा हैं और कॉपीराइट कानूनों द्वारा संरक्षित हैं।'
              : 'The proprietary user interface design, logo, branding, bilingual editorial guides, and source code of AI Photo Lab are protected under copyright and trademark laws.'}
          </p>
        </section>

        {/* Section 4: Limits of Liability & Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '4. दायित्व की सीमा और वारंटी अस्वीकरण (Limits of Liability)'
                : '4. Disclaimer of Warranties & Limitation of Liability'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab एक निःशुल्क ब्राउज़र-आधारित सुविधा है। हम यह सुनिश्चित करने का हर संभव प्रयास करते हैं कि सभी टूल्स सटीक और बग-मुक्त काम करें, लेकिन यह सेवा "जैसी है" (AS IS) आधार पर प्रदान की जाती है।'
              : 'AI Photo Lab is provided free of charge on an "AS IS" and "AS AVAILABLE" basis. While we strive to maintain impeccable mathematical accuracy across our dimension and compression algorithms, we make no express or implied warranties regarding uninterrupted or defect-free performance across every browser environment.'}
          </p>
          <p>
            {language === 'hi'
              ? 'किसी भी सरकारी परीक्षा फॉर्म, वीजा आवेदन या नौकरी पोर्टल पर फोटो अस्वीकृत होने से उत्पन्न किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए AI Photo Lab उत्तरदायी नहीं होगा। उपयोगकर्ताओं को आवेदन सबमिट करने से पहले आधिकारिक दिशानिर्देशों से मिलान करने की सलाह दी जाती है।'
              : 'In no event shall AI Photo Lab, its operators, or licensors be held liable for any direct, indirect, special, incidental, or consequential damages, including but not limited to application rejection, academic disqualification, or loss of profits arising out of the use of this utility.'}
          </p>
        </section>

        {/* Section 5: Modifications & Termination */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '5. नियमों में संशोधन और अधिकार'
                : '5. Modifications & Governing Law'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम किसी भी समय इन नियमों व शर्तों को अपडेट करने का अधिकार सुरक्षित रखते हैं। कोई भी संशोधन इस पृष्ठ पर पोस्ट होते ही तुरंत प्रभावी होगा।'
              : 'We reserve the right to revise or amend these Terms of Service at any time. Continued use of AI Photo Lab following revisions constitutes full acceptance of the updated terms.'}
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p>
            {language === 'hi'
              ? 'इन नियमों व शर्तों के संबंध में किसी भी कानूनी या परिचालन पूछताछ के लिए apextech.servicess@gmail.com पर संपर्क करें।'
              : 'For legal questions or formal inquiries regarding these Terms of Service, please contact our team at apextech.servicess@gmail.com.'}
          </p>
        </section>
      </div>
    </div>
  );
};
