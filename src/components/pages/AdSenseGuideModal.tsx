import React from 'react';
import { X, CheckCircle2, Globe, Search, DollarSign, ExternalLink, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdSenseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdSenseGuideModal: React.FC<AdSenseGuideModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-purple-100 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'hi'
                  ? 'वेबसाइट पब्लिश, सर्च कंसोल और Google AdSense गाइड'
                  : 'Publish, Search Console & Google AdSense Guide'}
              </h2>
              <p className="text-xs text-purple-200">
                {language === 'hi'
                  ? 'आसान हिंदी में संपूर्ण स्टेप-बाय-स्टेप निर्देश'
                  : 'Complete step-by-step publisher walkthrough'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Quick Notice Badge */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-900">
                {language === 'hi' ? 'वेबसाइट AdSense के लिए तैयार है!' : 'Website is AdSense-Ready!'}
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                {language === 'hi'
                  ? 'हमने इसमें सभी अनिवार्य पेजेस (Privacy Policy, Terms, About, Contact), सुरक्षित विज्ञापन प्लेसहोल्डर और उच्च-गुणवत्ता वाले मूल ट्यूटोरियल्स शामिल कर दिए हैं।'
                  : 'Mandatory compliance pages (Privacy Policy, Terms, About, Contact), isolated ad slots, and original educational tutorials are already configured.'}
              </p>
            </div>
          </div>

          {/* Section 1: Preview & Publish */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
            <div className="flex items-center gap-2.5 text-purple-700 font-bold text-base mb-3">
              <Globe className="w-5 h-5" />
              <h3>
                {language === 'hi'
                  ? 'स्टेप 1: वेबसाइट का पूर्वावलोकन (Preview) और पब्लिश (Publish) करना'
                  : 'Step 1: Previewing & Publishing Your Website'}
              </h3>
            </div>
            <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc list-inside">
              <li>
                <strong>{language === 'hi' ? 'पूर्वावलोकन जांचें:' : 'Check Preview:'}</strong>{' '}
                {language === 'hi'
                  ? 'कंप्रेसर, रीसाइज़र, कन्वर्टर और क्रॉप टूल में फोटो डालकर देखें कि डाउनलोड सुचारू रूप से हो रहा है।'
                  : 'Test the compressor, resizer, converter, and cropper to confirm in-browser downloads function smoothly.'}
              </li>
              <li>
                <strong>{language === 'hi' ? 'मोबाइल रिस्पॉन्सिवनेस:' : 'Mobile Responsiveness:'}</strong>{' '}
                {language === 'hi'
                  ? 'अपने स्मार्टफोन पर खोलकर देखें कि नेविगेशन मेन्यू, बटन और फॉर्म एकदम साफ़ दिख रहे हैं।'
                  : 'Open on your mobile device to ensure touch sliders and menus render cleanly.'}
              </li>
              <li>
                <strong>{language === 'hi' ? 'कस्टम डोमेन जोड़ना (वैकल्पिक):' : 'Custom Domain (Optional):'}</strong>{' '}
                {language === 'hi'
                  ? 'यदि आपके पास अपना .com या .in डोमेन है, तो DNS में CNAME या A-Record जोड़कर अपनी वेबसाइट को अपने ब्रांड डोमेन पर लाइव कर सकते हैं।'
                  : 'Map your custom .com or .in domain via DNS CNAME/A-records to your hosting deployment.'}
              </li>
            </ul>
          </div>

          {/* Section 2: Google Search Console */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
            <div className="flex items-center gap-2.5 text-indigo-700 font-bold text-base mb-3">
              <Search className="w-5 h-5" />
              <h3>
                {language === 'hi'
                  ? 'स्टेप 2: Google Search Console से कैसे कनेक्ट करें (गूगल सर्च में लाने के लिए)'
                  : 'Step 2: Connect to Google Search Console (For Google Search Indexing)'}
              </h3>
            </div>
            <div className="space-y-3 text-xs md:text-sm text-slate-600">
              <p>
                {language === 'hi'
                  ? 'गूगल सर्च कंसोल आपकी वेबसाइट को गूगल के सर्च रिजल्ट्स में दिखाने के लिए सबसे जरूरी टूल है:'
                  : 'Google Search Console indexes your pages so users can discover your tools via Google Search:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-800 text-xs mb-1">
                    {language === 'hi' ? '1. प्रॉपर्टी जोड़ें (Add Property)' : '1. Add Property'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'hi'
                      ? 'search.google.com/search-console पर जाएं, "URL Prefix" चुनें और अपनी वेबसाइट का URL दर्ज करें।'
                      : 'Visit search.google.com/search-console, select "URL Prefix", and enter your app URL.'}
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-800 text-xs mb-1">
                    {language === 'hi' ? '2. ओनरशिप वेरिफाई करें' : '2. Verify Ownership'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'hi'
                      ? 'HTML Tag विकल्प चुनें। गूगल आपको एक <meta> टैग देगा जिसे index.html के <head> में जोड़ना होता है।'
                      : 'Choose HTML Tag verification and place the provided meta tag in the <head> of index.html.'}
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-800 text-xs mb-1">
                    {language === 'hi' ? '3. Sitemap सबमिट करें' : '3. Submit Sitemap'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'hi'
                      ? 'Search Console में "Sitemaps" मेन्यू पर जाएं और sitemap.xml लिखकर सबमिट करें (यह फाइल पहले से तैयार है)।'
                      : 'Navigate to "Sitemaps" and submit sitemap.xml. The file is already built into this app.'}
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-800 text-xs mb-1">
                    {language === 'hi' ? '4. URL Inspection & Request Indexing' : '4. Request Indexing'}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {language === 'hi'
                      ? 'होमपेज और ट्यूटोरियल पेजों के लिंक डालकर "Request Indexing" पर क्लिक करें ताकि गूगल जल्दी क्रॉल करे।'
                      : 'Inspect key URLs and request indexing so Google bot crawls your photo tools promptly.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AdSense Approval Checklist */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base mb-3">
              <DollarSign className="w-5 h-5" />
              <h3>
                {language === 'hi'
                  ? 'स्टेप 3: Google AdSense अप्रूवल के लिए क्या करें और क्या न करें'
                  : 'Step 3: Google AdSense Approval Preparation & Golden Rules'}
              </h3>
            </div>
            <div className="space-y-2 text-xs md:text-sm text-slate-600">
              <p className="font-medium text-slate-800">
                {language === 'hi'
                  ? 'गूगल एडसेंस अप्रूवल प्राप्त करने के लिए इन नियमों का पालन करें:'
                  : 'Follow these strict Google AdSense guidelines for fast approval:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                  <div className="text-emerald-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {language === 'hi' ? 'क्या करें (DOs):' : 'What to Do:'}
                  </div>
                  <ul className="text-[12px] space-y-1 list-disc list-inside text-emerald-950">
                    <li>
                      {language === 'hi'
                        ? 'Privacy Policy, Terms, About Us और Contact Us पेजों को हमेशा एक्टिव रखें।'
                        : 'Keep Privacy Policy, Terms, About, and Contact pages visible in header/footer.'}
                    </li>
                    <li>
                      {language === 'hi'
                        ? 'मूल सामग्री रखें (हमने इसमें 5 विस्तृत द्विभाषी ट्यूटोरियल्स शामिल किए हैं)।'
                        : 'Provide rich original content (5 detailed bilingual tutorials included).'}
                    </li>
                    <li>
                      {language === 'hi'
                        ? 'सर्च कंसोल से थोड़ा ऑर्गेनिक ट्रैफिक आने के बाद ही अप्लाई करें (लगभग 10-15 दिन बाद)।'
                        : 'Apply after receiving initial organic crawl impressions from Search Console.'}
                    </li>
                  </ul>
                </div>
                <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-3">
                  <div className="text-rose-800 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-600" />
                    {language === 'hi' ? 'क्या कभी न करें (DON’Ts):' : 'What Never to Do:'}
                  </div>
                  <ul className="text-[12px] space-y-1 list-disc list-inside text-rose-950">
                    <li>
                      {language === 'hi'
                        ? 'डाउनलोड बटन के ठीक ऊपर या नीचे कभी विज्ञापन न लगाएं (यह एडसेंस नीति का उल्लंघन है)।'
                        : 'Never place ads right next to download buttons (causes accidental clicks).'}
                    </li>
                    <li>
                      {language === 'hi'
                        ? 'अप्रूवल मिलने से पहले कभी फर्जी या डमी विज्ञापन कोड न डालें।'
                        : 'Never insert fake ad code or mock advertisements before official approval.'}
                    </li>
                    <li>
                      {language === 'hi'
                        ? 'अपने दोस्तों से विज्ञापनों पर क्लिक करने को कभी न कहें।'
                        : 'Never click your own ads or encourage artificial traffic.'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* How to insert ad code */}
              <div className="mt-4 p-3 bg-purple-50/80 border border-purple-200 rounded-lg">
                <span className="font-semibold text-xs text-purple-900 block mb-1">
                  {language === 'hi'
                    ? 'अप्रूवल के बाद कोड कैसे लगाएं:'
                    : 'How to paste AdSense snippet once approved:'}
                </span>
                <p className="text-[12px] text-purple-800">
                  {language === 'hi'
                    ? 'जब Google AdSense से आपका खाता स्वीकृत हो जाए, तो आपको एक पब्लिशर आईडी (ca-pub-XXXXXXXXXX) मिलेगी। आप index.html के <head> में Google AdSense का ऑटो-ऐड स्क्रिप्ट जोड़ सकते हैं और हमारे AdSenseBanner कंपोनेंट में अपना स्लॉट कोड पेस्ट कर सकते हैं।'
                    : 'Once your AdSense account is approved, copy your publisher tag script into index.html and update the AdSenseBanner slot ID with your ad unit code.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            AI Photo Lab • Official Publisher Guidance
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            {language === 'hi' ? 'समझ गया (Close)' : 'Got it (Close)'}
          </button>
        </div>
      </div>
    </div>
  );
};
