import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ChevronDown, CheckCircle2, Film, Sliders, Sparkles, HelpCircle, Table, Share2, ShieldCheck, Zap } from 'lucide-react';

export const VideoCompressorSeoContent: React.FC = () => {
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const platformSpecs = [
    {
      platform: 'WhatsApp (Direct Video)',
      maxLimit: '16 MB',
      recRes: '720p (1280x720) or 480p (854x480)',
      recFps: '30 FPS',
      recBitrate: '1.0 - 1.5 Mbps',
      codec: 'MP4 (H.264 / AAC)',
      notesEn: 'Exceeding 16MB triggers WhatsApp server re-compression, drastically blurring video. Pre-compressing keeps your video sharp.',
      notesHi: '16MB से अधिक होने पर व्हाट्सएप वीडियो को खुद दोबारा कंप्रेस कर देता है जिससे वीडियो धुंधला हो जाता है। पहले से कंप्रेस करके भेजने पर वीडियो साफ रहता है।'
    },
    {
      platform: 'WhatsApp (Document Mode)',
      maxLimit: '64 MB - 100 MB',
      recRes: '1080p (1920x1080) or 720p',
      recFps: '30 FPS',
      recBitrate: '2.5 - 3.5 Mbps',
      codec: 'MP4 / MKV',
      notesEn: 'Sending as Document retains original bitstream without automatic WhatsApp compression.',
      notesHi: 'डॉक्यूमेंट के रूप में भेजने पर फाइल बिना किसी री-कंप्रेशन के मूल क्लैरिटी में ट्रांसफर होती है।'
    },
    {
      platform: 'Email (Gmail & Outlook)',
      maxLimit: '25 MB strict',
      recRes: '720p or 480p (depending on length)',
      recFps: '24 or 30 FPS',
      recBitrate: '800 kbps - 1.2 Mbps',
      codec: 'MP4 (Universal playback)',
      notesEn: 'Attachments above 25MB get converted into cloud links (Google Drive/OneDrive). Keep under 24MB for direct attachment.',
      notesHi: '25MB से बड़ी फाइल गूगल ड्राइव लिंक बन जाती है। डायरेक्ट अटैचमेंट के लिए फाइल 24MB के अंदर रखें।'
    },
    {
      platform: 'Discord (Standard Free Tier)',
      maxLimit: '10 MB (formerly 8/25 MB)',
      recRes: '720p or 480p',
      recFps: '30 FPS',
      recBitrate: '700 kbps - 1.0 Mbps',
      codec: 'MP4 / WebM',
      notesEn: 'Non-Nitro accounts have strict upload caps. 480p at 900 kbps is ideal for 1-2 minute gaming clips.',
      notesHi: 'फ्री डिस्कोर्ड पर सख्त लिमिट होती है। 1-2 मिनट की गेमिंग क्लिप के लिए 480p और 900 kbps सबसे उपयुक्त है।'
    },
    {
      platform: 'Online Portals & Job Applications',
      maxLimit: '10 MB to 50 MB',
      recRes: '720p HD (1280x720)',
      recFps: '24 or 30 FPS',
      recBitrate: '1.2 - 2.0 Mbps',
      codec: 'Standard MP4',
      notesEn: 'Self-introduction or portfolio videos require crisp voice clarity with lightweight overall size.',
      notesHi: 'इंट्रोडक्शन और प्रोजेक्ट वीडियो के लिए ऑडियो स्पष्टता और हल्का फाइल साइज सबसे जरूरी है।'
    }
  ];

  const faqs = [
    {
      qEn: 'What is the relationship between Video Bitrate, Resolution, and Final File Size?',
      qHi: 'वीडियो बिटरेट (Bitrate), रेजोल्यूशन और अंतिम फाइल साइज में क्या संबंध है?',
      aEn: 'The final file size of any digital video is calculated using the formula: File Size (in Megabytes) = [Total Bitrate in kbps × Duration in seconds] / 8192. Resolution (1080p, 720p, 480p) determines the pixel dimensions of each video frame, while Bitrate determines how much digital data is allocated per second to render those pixels. If you downscale resolution from 1080p to 720p, you can decrease the bitrate by 50% without introducing noticeable compression artifacts or blurriness.',
      aHi: 'किसी भी डिजिटल वीडियो का अंतिम साइज इस सूत्र से तय होता है: File Size (MB) = [कुल बिटरेट (kbps) × अवधि (सेकंड)] / 8192। रेजोल्यूशन फ्रेम के पिक्सल माप को तय करता है, जबकि बिटरेट यह तय करता है कि प्रति सेकंड कितने डेटा का उपयोग किया जाए। 1080p से 720p पर डाउनस्केल करने से आप बिना क्वालिटी खोए बिटरेट को 50% तक कम कर सकते हैं।'
    },
    {
      qEn: 'What is the difference between CBR (Constant Bitrate) and VBR (Variable Bitrate)?',
      qHi: 'CBR (कांस्टेंट बिटरेट) और VBR (वेरिएबल बिटरेट) में क्या अंतर है?',
      aEn: 'Constant Bitrate (CBR) encodes every second of video with the exact same data rate regardless of scene complexity, which can waste file size during static scenes and blur during fast motion. Variable Bitrate (VBR) dynamically allocates higher bitrates to high-motion, detailed sequences (such as action scenes or fast panning) and saves data during simple or static frames. AI Photo Lab optimizes video stream chunks dynamically to balance small file size with crisp clarity.',
      aHi: 'CBR हर सेकंड में एक समान डेटा दर का उपयोग करता है, चाहे सीन स्थिर हो या गतिमान। वहीं VBR जटिल और तेज़ मूवमेंट वाले दृश्यों में अधिक बिटरेट देता है और शांत दृश्यों में डेटा बचाता है। AI Photo Lab संतुलित एनकोडिंग का उपयोग करता है ताकि फाइल साइज छोटा रहे और दृश्य स्पष्ट रहे।'
    },
    {
      qEn: 'How does reducing Frame Rate (FPS) from 60 FPS to 30 FPS affect video compression?',
      qHi: 'फ्रेम रेट (FPS) को 60 से 30 करने पर वीडियो कंप्रेशन पर क्या असर पड़ता है?',
      aEn: 'Standard cinematic video plays at 24 FPS, while television and online web video standardly playback at 30 FPS. High frame rates like 60 FPS or 120 FPS require rendering twice or four times as many individual frames every second. For tutorials, vlogs, lectures, and messaging clips, dropping from 60 FPS to 30 FPS immediately cuts temporal data overhead by approximately 30-40% with zero perceived drop in clarity.',
      aHi: 'सिनेमा 24 FPS पर और ऑनलाइन वीडियो सामान्यतः 30 FPS पर चलते हैं। 60 FPS में प्रति सेकंड दोगुनी तस्वीरें होती हैं जिससे फाइल साइज बहुत बढ़ जाता है। ट्यूटोरियल, भाषण और सामान्य वीडियो के लिए 60 FPS को 30 FPS करने से बिना किसी विजुअल खराबी के साइज 30% से 40% तक कम हो जाता है।'
    },
    {
      qEn: 'Is it completely safe and private to compress sensitive videos on AI Photo Lab?',
      qHi: 'क्या AI Photo Lab पर संवेदनशील या निजी वीडियो कंप्रेस करना पूरी तरह सुरक्षित है?',
      aEn: 'Yes, 100%. AI Photo Lab utilizes client-side HTML5 Video and Canvas stream capture with browser-native MediaRecorder encoding. Your video file is read entirely from your computer or phone’s local memory and encoded locally in sandbox memory. Zero bytes of video data are ever uploaded to, transmitted to, or stored on any external server.',
      aHi: 'हाँ, शत-प्रतिशत। AI Photo Lab आपके ब्राउज़र के अंदर ही क्लाइंट-साइड Canvas और MediaRecorder API के जरिए वीडियो कंप्रेस करता है। आपकी वीडियो फाइल आपके डिवाइस की मेमोरी में ही प्रोसेस होती है और कभी किसी बाहरी सर्वर पर अपलोड या स्टोर नहीं की जाती।'
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
          <Film className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'गहन वीडियो कंप्रेशन गाइड' : 'Complete Video Compression Guide'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi'
            ? 'वीडियो कंप्रेस कैसे करें: बिटरेट, रेजोल्यूशन, FPS और कोडेक की संपूर्ण जानकारी'
            : 'How Video Compression Works: Mastering Bitrates, Resolutions, FPS & Codecs'}
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'चाहे आपको व्हाट्सएप पर 16MB की लिमिट में वीडियो भेजना हो, ईमेल में 25MB अटैचमेंट भेजना हो या डिस्कोर्ड पर गेमिंग क्लिप शेयर करनी हो—वीडियो कंप्रेस करते समय सही सेटिंग्स चुनना आवश्यक है ताकि वीडियो का साइज भी घटे और उसकी क्वालिटी भी न बिगड़े।'
            : 'Whether you need to send a video under WhatsApp’s 16MB cap, attach a presentation to Gmail within the 25MB threshold, or share a clip on Discord—properly balancing bitrate, resolution downscaling, and audio channels allows you to shrink video file size by up to 80% without introducing pixelation.'}
        </p>
      </div>

      {/* Core Technical Concepts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {language === 'hi' ? '1. बिटरेट (Bitrate)' : '1. Video Bitrate (kbps/Mbps)'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'बिटरेट वीडियो में प्रति सेकंड प्रोसेस होने वाले डेटा की मात्रा है। 1080p वीडियो में सामान्यतः 5 से 8 Mbps बिटरेट होता है। इसे समझदारी से 1.2 से 2.0 Mbps पर लाने से फाइल साइज 70% तक घट जाता है।'
              : 'Bitrate measures the volume of data bits processed per second. Standard 1080p clips use 5–8 Mbps. Tuning this to 1.2–2.0 Mbps drops file size by 70% while keeping visual clarity crisp.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {language === 'hi' ? '2. रेजोल्यूशन स्केलिंग' : '2. Resolution Scaling'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'मोबाइल स्क्रीन पर 720p (1280x720) और 1080p (1920x1080) में अंतर पहचानना लगभग असंभव होता है। रेजोल्यूशन 1080p से 720p या 480p करने से पिक्सल लोड बहुत कम हो जाता है।'
              : 'On smartphone screens, distinguishing between 720p (HD) and 1080p (Full HD) is imperceptible. Downscaling 1080p to 720p or 480p dramatically cuts file overhead.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {language === 'hi' ? '3. FPS और ऑडियो कोडेक' : '3. Frame Rate (FPS) & Audio'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'सोशल मीडिया व सामान्य उपयोग के लिए 30 FPS सबसे उपयुक्त है। साथ ही AAC या MP3 ऑडियो स्ट्रीम को 96-128 kbps पर सेट करने से बिना आवाज की गुणवत्ता खोए भारी बचत होती है।'
              : '30 FPS is the global web standard. Downsampling unnecessary 60 FPS video and packaging stereo audio with high-efficiency AAC at 96–128 kbps saves massive megabytes.'}
          </p>
        </div>
      </div>

      {/* Platform Specification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-1">
              <Table className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्लेटफ़ॉर्म आवश्यकताएँ' : 'Platform Target Limits'}</span>
            </div>
            <h3 className="text-lg font-bold">
              {language === 'hi'
                ? 'व्हाट्सएप, ईमेल और डिस्कोर्ड के लिए वीडियो साइज और सेटिंग्स टेबल'
                : 'Recommended Video Compression Limits for Messaging & Social Apps'}
            </h3>
          </div>
          <span className="text-xs bg-purple-900/80 text-purple-200 px-3 py-1.5 rounded-lg border border-purple-700/50 self-start sm:self-auto">
            {language === 'hi' ? 'अद्यतित मानक' : 'Updated Standards'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{language === 'hi' ? 'प्लेटफॉर्म' : 'Platform'}</th>
                <th className="py-3.5 px-4">{language === 'hi' ? 'साइज सीमा (Max Limit)' : 'Max File Limit'}</th>
                <th className="py-3.5 px-4">{language === 'hi' ? 'अनुशंसित रेजोल्यूशन' : 'Optimal Resolution'}</th>
                <th className="py-3.5 px-4">{language === 'hi' ? 'बिटरेट / FPS' : 'Target Bitrate & FPS'}</th>
                <th className="py-3.5 px-4 min-w-[200px]">{language === 'hi' ? 'महत्वपूर्ण सुझाव' : 'Best Practice Note'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {platformSpecs.map((spec, i) => (
                <tr key={i} className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{spec.platform}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {spec.maxLimit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-purple-700 font-semibold">{spec.recRes}</td>
                  <td className="py-3.5 px-4">{spec.recBitrate} • {spec.recFps}</td>
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
              ? 'AI Photo Lab पर वीडियो कैसे कंप्रेस करें (4 आसान स्टेप्स):'
              : 'Step-by-Step: Compressing Video in Browser with AI Photo Lab'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'वीडियो चुनें' : 'Upload Video'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'अपने फोन या कंप्यूटर से MP4, WebM या MOV वीडियो फाइल सेलेक्ट करें या ड्रैग-एंड-ड्रॉप करें।'
                : 'Drag and drop your MP4, WebM, or MOV video file directly into the local processing zone.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'प्रोफाइल सेट करें' : 'Select Target Profile'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'संतुलित (Balanced 720p) या सबसे छोटा साइज (Small 480p) चुनें और ऑडियो विकल्प ऑन/ऑफ करें।'
                : 'Choose High Quality, Balanced 720p, or Small 480p based on whether you need WhatsApp 16MB or email.'}
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-purple-200 mb-1">
              {language === 'hi' ? 'ब्राउज़र में प्रोसेस' : 'Client-Side Encoding'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'कंप्रेस बटन दबाएं। आपका ब्राउज़र बिना किसी सर्वर अपलोड के वीडियो को स्थानीय मेमोरी में एनकोड करता है।'
                : 'Hit Start. The browser hardware-accelerated MediaRecorder dynamically quantizes frames in real time.'}
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
                ? 'नया वीडियो चलाकर देखें और "Download Compressed Video" पर क्लिक करके तुरंत सुरक्षित सेव करें।'
                : 'Preview the lightweight output video player side-by-side and download the finished file instantly.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions (Video Compression FAQs)'}
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
