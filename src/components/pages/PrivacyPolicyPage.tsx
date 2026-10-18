import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Lock, EyeOff, Server, Cookie, Globe, Database, HelpCircle } from 'lucide-react';

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
            ? 'अंतिम संशोधन: हालिया • Google AdSense व GDPR/CCPA अनुपालक'
            : 'Last Updated: Recent • AdSense, GDPR & CCPA Compliant'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
        {/* Core Guarantee */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5">
          <Lock className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-emerald-950 text-base">
              {language === 'hi'
                ? 'हमारा मूल गोपनीयता वादा: शून्य सर्वर स्टोरेज (Zero Storage Guarantee)'
                : 'Our Core Promise: Zero Image & Video Server Storage'}
            </h2>
            <p className="text-xs md:text-sm text-emerald-900 leading-relaxed">
              {language === 'hi'
                ? 'जब आप AI Photo Lab पर किसी फोटो या वीडियो को कंप्रेस, रीसाइज, पासपोर्ट फोटो में कन्वर्ट या बैकग्राउंड रिमूव करते हैं, तो आपकी फाइलें पूरी तरह से आपके ब्राउज़र की लोकल मेमोरी में प्रोसेस होती हैं। हम आपके किसी भी फोटो, वीडियो या व्यक्तिगत दस्तावेज को किसी भी रिमोट सर्वर पर स्थायी रूप से स्टोर, आर्काइव या मॉनिटर नहीं करते हैं।'
                : 'When you use AI Photo Lab to compress, resize, format, or edit photos and videos, all operations execute client-side inside your web browser sandbox (via HTML5 Canvas, WebAssembly, and local Blob APIs). We do not permanently store, inspect, archive, or retain your personal files on our servers.'}
            </p>
          </div>
        </div>

        {/* Section 1: Information We Do Not Collect */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '1. वह जानकारी जो हम कभी एकत्र नहीं करते'
                : '1. Information We Do Not Collect'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम आपकी तस्वीरों, बायोमेट्रिक चेहरों, हस्ताक्षर, मार्कशीट, आधार/पैन दस्तावेजों या EXIF कैमरा मेटाडेटा को एकत्र या शेयर नहीं करते। आप जो भी फाइलें चुनते हैं, वे केवल आपके डिवाइस पर ही रेंडर और डाउनलोड होती हैं।'
              : 'We strictly refrain from harvesting, indexing, or retaining your uploaded personal images, facial biometrics, signatures, identity credentials, or raw EXIF camera metadata. Selected files are parsed ephemerally inside your local browser runtime.'}
          </p>
        </section>

        {/* Section 2: Google AdSense & DoubleClick Cookies */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '2. Google AdSense, DoubleClick कुकीज़ और तृतीय-पक्ष विज्ञापन'
                : '2. Google AdSense, DoubleClick DART Cookies & Third-Party Advertising'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'AI Photo Lab इस सेवा को सभी उपयोगकर्ताओं के लिए 100% मुफ्त बनाए रखने के लिए Google AdSense और अन्य अधिकृत विज्ञापन नेटवर्कों के माध्यम से प्रासंगिक विज्ञापन प्रदर्शित करता है।'
              : 'AI Photo Lab utilizes Google AdSense and third-party advertising vendors to support and fund free tool operations for users across the globe.'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600">
            <li>
              <strong>Google as a Third-Party Vendor:</strong> Google uses cookies (including the DoubleClick DART cookie) to serve advertisements to users based on their visits to this website and other websites across the Internet.
            </li>
            <li>
              <strong>Personalized Advertising Opt-Out:</strong> Users may freely opt out of personalized interest-based advertising by visiting{' '}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline font-medium"
              >
                Google My Ad Center
              </a>{' '}
              or by opting out through the Network Advertising Initiative at{' '}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline font-medium"
              >
                aboutads.info
              </a>.
            </li>
            <li>
              <strong>Third-Party Ad Networks:</strong> Third-party ad servers or networks may employ technologies like cookies, JavaScript, or Web Beacons that measure advertisement effectiveness and personalize advertising content. AI Photo Lab has no access to or control over these cookies used by third-party advertisers.
            </li>
          </ul>
        </section>

        {/* Section 3: Standard Server Log Files */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '3. सर्वर लॉग फाइल्स (Standard Log Files)'
                : '3. Log Files & Anonymous Diagnostics'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'अधिकांश आधुनिक वेबसाइटों की तरह, हम सामान्य होस्टिंग सर्वर लॉग्स (जैसे इंटरनेट प्रोटोकॉल (IP) पता, ब्राउज़र का प्रकार, रेफरिंग/एग्जिट पेज, और टाइमस्टैम्प) का उपयोग केवल साइट सुरक्षा, डीडीओएस सुरक्षा और सर्वर प्रदर्शन निगरानी के लिए करते हैं। यह डेटा किसी भी व्यक्तिगत रूप से पहचान योग्य जानकारी से लिंक नहीं होता है।'
              : 'AI Photo Lab follows standard industry logging procedures via its hosting network. Log files record anonymous technical metadata including Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and click counts. This diagnostic data is strictly used for infrastructure monitoring, DDoS defense, and technical optimization, and is not linked to personally identifiable information.'}
          </p>
        </section>

        {/* Section 4: GDPR Privacy Rights (European Users) */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '4. GDPR डेटा संरक्षण अधिकार (यूरोपीय उपयोगकर्ताओं के लिए)'
                : '4. GDPR Data Protection Rights (EEA & UK Users)'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'यूरोपीय संघ के सामान्य डेटा संरक्षण विनियमन (GDPR) के तहत, उपयोगकर्ताओं को अपने डेटा तक पहुंच, सुधार, मिटाने (राइट टू बी फॉरगॉटन), और प्रोसेसिंग को सीमित करने का पूर्ण अधिकार है। चूंकि हम कोई उपयोगकर्ता खाता या व्यक्तिगत फोटो डेटाबेस नहीं रखते, इसलिए आपका व्यक्तिगत डेटा पहले से ही पूरी तरह आपके नियंत्रण में रहता है।'
              : 'Under the General Data Protection Regulation (GDPR), users located within the European Economic Area possess the right to access, rectify, restrict, or request erasure of their personal data. Because AI Photo Lab operates an account-free, zero-upload architecture, we hold no user accounts, profile records, or personal photo databases.'}
          </p>
        </section>

        {/* Section 5: CCPA / CPRA Rights (California Residents) */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '5. CCPA / CPRA गोपनीयता अधिकार (कैलिफ़ोर्निया निवासी)'
                : '5. California Consumer Privacy Act (CCPA / CPRA)'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'कैलिफ़ोर्निया उपभोक्ता गोपनीयता अधिनियम के तहत, हम स्पष्ट करते हैं कि AI Photo Lab उपयोगकर्ताओं की किसी भी व्यक्तिगत जानकारी को किसी तीसरे पक्ष को बेचता (Sell) या साझा (Share) नहीं करता है।'
              : 'Under the California Consumer Privacy Act (CCPA), California residents have the right to request disclosure of categories and specific pieces of collected personal data, and to request deletion. We explicitly declare: AI Photo Lab DOES NOT sell or rent your personal information to third parties.'}
          </p>
        </section>

        {/* Section 6: Local Storage */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'hi'
                ? '6. ब्राउज़र लोकल स्टोरेज'
                : '6. Browser Local Storage Policy'}
            </span>
          </h2>
          <p>
            {language === 'hi'
              ? 'हम केवल आपकी भाषा पसंद (हिंदी या अंग्रेजी) को सुरक्षित रखने के लिए ब्राउज़र के लोकल स्टोरेज का उपयोग करते हैं।'
              : 'We use local storage exclusively to persist your interface language preference (English/Hindi). No tracking tokens, passwords, or personal files are placed in storage.'}
          </p>
        </section>

        {/* Section 7: Contact */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'hi' ? '7. गोपनीयता अधिकारी से संपर्क' : '7. Contacting Our Privacy Team'}
          </h2>
          <p>
            {language === 'hi'
              ? 'यदि आपके पास इस गोपनीयता नीति या हमारी डेटा प्रथाओं के बारे में कोई प्रश्न हैं, तो कृपया हमें apextech.servicess@gmail.com पर संपर्क करें।'
              : 'For questions, clarifications, or requests regarding this Privacy Policy, please email our support team at apextech.servicess@gmail.com.'}
          </p>
        </section>
      </div>
    </div>
  );
};
