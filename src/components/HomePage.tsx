import React, { useState } from 'react';
import { ToolId, TutorialItem, PageView } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { TUTORIALS_DATA } from '../data/tutorialsData';
import { AdSenseBanner } from './AdSenseBanner';
import { Logo } from './Logo';
import {
  Sliders,
  Maximize2,
  RefreshCw,
  Crop,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Search,
  Clock,
  HelpCircle,
  FileCheck,
  Award,
  Film,
} from 'lucide-react';

interface HomePageProps {
  onSelectTool: (toolId: ToolId) => void;
  onSelectTutorial: (tutorial: TutorialItem) => void;
  onNavigateView: (view: PageView) => void;
  onOpenAdGuide?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onSelectTutorial,
  onNavigateView,
  onOpenAdGuide,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const allTools = [
    {
      id: 'compress' as ToolId,
      name: t.tools.compress.name,
      desc: t.tools.compress.shortDesc,
      icon: Sliders,
      badge: t.tools.compress.badge,
      color: 'from-purple-500 to-indigo-600',
      popular: true,
    },
    {
      id: 'resize' as ToolId,
      name: t.tools.resize.name,
      desc: t.tools.resize.shortDesc,
      icon: Maximize2,
      badge: t.tools.resize.badge,
      color: 'from-indigo-500 to-blue-600',
      popular: true,
    },
    {
      id: 'convert' as ToolId,
      name: t.tools.convert.name,
      desc: t.tools.convert.shortDesc,
      icon: RefreshCw,
      badge: t.tools.convert.badge,
      color: 'from-violet-500 to-purple-600',
      popular: true,
    },
    {
      id: 'crop' as ToolId,
      name: t.tools.crop.name,
      desc: t.tools.crop.shortDesc,
      icon: Crop,
      badge: t.tools.crop.badge,
      color: 'from-purple-600 to-pink-600',
      popular: false,
    },
    {
      id: 'passport' as ToolId,
      name: t.tools.passport.name,
      desc: t.tools.passport.shortDesc,
      icon: ShieldCheck,
      badge: t.tools.passport.badge,
      color: 'from-emerald-500 to-teal-600',
      popular: true,
    },
    {
      id: 'cutout' as ToolId,
      name: t.tools.cutout.name,
      desc: t.tools.cutout.shortDesc,
      icon: Sparkles,
      badge: t.tools.cutout.badge,
      color: 'from-purple-500 to-violet-600',
      popular: false,
    },
    {
      id: 'video-compress' as ToolId,
      name: t.tools['video-compress'].name,
      desc: t.tools['video-compress'].shortDesc,
      icon: Film,
      badge: t.tools['video-compress'].badge,
      color: 'from-fuchsia-600 to-purple-700',
      popular: true,
    },
  ];

  const filteredTools = allTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredTutorials = TUTORIALS_DATA.slice(0, 3);

  const faqs = [
    {
      qEn: 'Are my photos uploaded to your server?',
      qHi: 'क्या मेरी फोटो आपके सर्वर पर अपलोड होती है?',
      aEn: 'No! AI Photo Lab executes 100% inside your web browser using HTML5 Canvas. Your photos never leave your phone or computer.',
      aHi: 'बिल्कुल नहीं! AI Photo Lab 100% आपके वेब ब्राउज़र के अंदर ही चलता है। आपकी फोटो आपके फोन या कंप्यूटर से बाहर नहीं जाती।',
    },
    {
      qEn: 'Is there any daily limit or payment required?',
      qHi: 'क्या कोई दैनिक सीमा या भुगतान की आवश्यकता है?',
      aEn: 'Our core tools are completely free with zero limits, zero paywalls, and no account signup needed.',
      aHi: 'हमारे सभी मुख्य टूल्स पूरी तरह से मुफ्त और असीमित हैं। किसी खाते या क्रेडिट कार्ड की आवश्यकता नहीं है।',
    },
    {
      qEn: 'How can I resize a photo for SSC/UPSC exam under 50KB?',
      qHi: 'SSC/UPSC फॉर्म के लिए 50KB से छोटी फोटो कैसे बनाएं?',
      aEn: 'Use our "Passport Photo Maker" or "Image Compressor" tool. Select the India Govt preset and adjust the target KB slider to 45 KB.',
      aHi: 'हमारे "पासपोर्ट फोटो मेकर" या "फोटो कंप्रेसर" टूल का उपयोग करें। सरकारी फॉर्म प्रीसेट चुनें और टारगेट KB को 45 KB पर सेट करें।',
    },
    {
      qEn: 'Which format should I use for faster website loading?',
      qHi: 'वेबसाइट को तेज लोड करने के लिए कौन सा फॉर्मेट सबसे अच्छा है?',
      aEn: 'WebP is the recommended modern format. It is typically 25% to 35% lighter than JPG while preserving sharp visual quality.',
      aHi: 'WebP सबसे आधुनिक फॉर्मेट है। यह JPG की तुलना में 25% से 35% हल्का होता है और क्वालिटी भी साफ़ रहती है।',
    },
  ];

  const examSpecs = [
    {
      exam: 'SSC (CGL, CHSL, GD, MTS, CPO)',
      examHi: 'एसएससी (CGL, CHSL, GD, MTS)',
      photoSize: '20 KB – 50 KB (3.5 × 4.5 cm / 100×120 px)',
      sigSize: '10 KB – 20 KB (4.0 × 2.0 cm / 140×60 px)',
      notes: 'White or light background, clear face without spectacles/cap.',
      notesHi: 'सफेद या हल्का बैकग्राउंड, बिना चश्मे/टोपी के स्पष्ट चेहरा।',
      tool: 'compress' as ToolId,
    },
    {
      exam: 'UPSC (Civil Services CSE, NDA, CDS)',
      examHi: 'यूपीएससी (CSE, NDA, CDS)',
      photoSize: '20 KB – 300 KB (Min 350×350 px, Max 1000×1000 px)',
      sigSize: '20 KB – 300 KB (Min 350×350 px)',
      notes: 'Photo taken within 10 days, name of candidate and date printed on photo.',
      notesHi: '10 दिन के अंदर खींची फोटो, फोटो पर नाम और तारीख आवश्यक।',
      tool: 'passport' as ToolId,
    },
    {
      exam: 'IBPS / SBI Banking (PO & Clerk)',
      examHi: 'आईबीपीएस / एसबीआई बैंक (PO, Clerk)',
      photoSize: '20 KB – 50 KB (200 × 230 pixels, 4.5 × 3.5 cm)',
      sigSize: '10 KB – 20 KB (140 × 60 pixels)',
      notes: 'Light colored or white background, black ink pen signature.',
      notesHi: 'हल्का या सफेद बैकग्राउंड, काली स्याही से हस्ताक्षर।',
      tool: 'compress' as ToolId,
    },
    {
      exam: 'Railway RRB (NTPC, Group D, ALP)',
      examHi: 'रेलवे आरआरबी (NTPC, Group D, ALP)',
      photoSize: '20 KB – 50 KB (35 × 45 mm, Color Photo)',
      sigSize: '10 KB – 40 KB (White paper with black/blue pen)',
      notes: 'Plain white background, no selfie, front view looking straight.',
      notesHi: 'सफेद बैकग्राउंड, सेल्फी मान्य नहीं, सामने सीधी नजर।',
      tool: 'passport' as ToolId,
    },
    {
      exam: 'State PSCs (UPPSC, BPSC, MPPSC, MPSC)',
      examHi: 'राज्य लोक सेवा आयोग (UPPSC, BPSC, MPPSC)',
      photoSize: '20 KB – 50 KB (3.5 × 4.5 cm)',
      sigSize: '10 KB – 20 KB (3.5 × 1.5 cm)',
      notes: 'Color photograph with white background, JPEG format only.',
      notesHi: 'सफेद बैकग्राउंड वाली रंगीन फोटो, केवल JPEG फॉर्मेट।',
      tool: 'compress' as ToolId,
    },
    {
      exam: 'PAN Card (NSDL / UTIITSL)',
      examHi: 'पैन कार्ड (NSDL / UTIITSL)',
      photoSize: 'Under 50 KB (3.5 × 2.5 cm / 200 DPI)',
      sigSize: 'Under 50 KB (2.0 × 4.5 cm / 200 DPI)',
      notes: 'Color photograph 200 DPI, Signature in rectangular box.',
      notesHi: '200 DPI रंगीन फोटो, निर्धारित बॉक्स में हस्ताक्षर।',
      tool: 'resize' as ToolId,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/80 via-white to-slate-50 pt-10 pb-16 md:pt-16 md:pb-22 border-b border-purple-100/60">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Full Official Logo Mockup Showcase */}
          <div className="mb-6">
            <Logo variant="hero" size={175} />
          </div>

          {/* Trust Badges Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-bold mb-4 shadow-xs">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-700" />
              {t.badges.clientSide}
            </span>
            <span className="text-purple-400">•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-purple-700" />
              {t.badges.fast}
            </span>
            <span className="text-purple-400">•</span>
            <span>{t.badges.freeForever}</span>
          </div>

          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtagline}
          </p>

          {/* Quick Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-purple-200 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
              <Search className="w-5 h-5 text-purple-500 ml-4 shrink-0" />
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-3.5 text-sm text-slate-800 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick CTA button shortcuts */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'hi' ? 'लोकप्रिय टूल्स:' : 'Popular Tools:'}
            </span>
            <button
              onClick={() => onSelectTool('compress')}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 font-semibold transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'कंप्रेसर' : 'Compressor'}
            </button>
            <button
              onClick={() => onSelectTool('passport')}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 font-semibold transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'पासपोर्ट (SSC/UPSC)' : 'Passport (35x45mm)'}
            </button>
            <button
              onClick={() => onSelectTool('resize')}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 font-semibold transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'रीसाइज़र' : 'Resizer'}
            </button>
            <button
              onClick={() => onSelectTool('video-compress')}
              className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Film className="w-3 h-3" />
              <span>{language === 'hi' ? 'वीडियो कंप्रेसर' : 'Video Compressor'}</span>
            </button>
            <button
              onClick={() => onSelectTool('convert')}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 font-semibold transition-colors cursor-pointer"
            >
              WebP Converter
            </button>
          </div>
        </div>
      </section>

      {/* Main Tool Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {t.tools.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.tools.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTool(tool.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTool(tool.id);
                  }
                }}
                aria-label={tool.name}
                className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-purple-400 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2">
                    {tool.name}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-700">
                  <span className="inline-flex items-center gap-1">
                    <span>{language === 'hi' ? 'टूल खोलें' : 'Open Tool'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {language === 'hi' ? 'तुरंत' : 'Instant'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Government Exam & Portal Photo/Signature Resizer Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-purple-800/50">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-3">
              <FileCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>{language === 'hi' ? 'सरकारी भर्ती व परीक्षा विशेष' : 'Sarkari Exam Photo & Signature Guide'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'hi'
                ? 'सरकारी फॉर्म फोटो और सिग्नेचर साइज गाइड (SSC, UPSC, रेलवे, बैंक)'
                : 'Government Exam Photo & Signature Resizer Specs (SSC, UPSC, Banking, RRB)'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              {language === 'hi'
                ? 'सरकारी परीक्षाओं में गलत फोटो या सिग्नेचर साइज के कारण फॉर्म रिजेक्ट होने से बचाएं। नीचे दी गई तालिका से अपनी परीक्षा चुनें और एक क्लिक में सही साइज (20KB - 50KB) बनाएं।'
                : 'Avoid application rejection due to incorrect photo or signature dimensions. Click any preset to instantly compress and resize for your application.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-purple-800/80 text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Exam / Portal</th>
                  <th className="py-3 px-3">Photo Specs (KB & Size)</th>
                  <th className="py-3 px-3">Signature Specs</th>
                  <th className="py-3 px-3">Requirements</th>
                  <th className="py-3 px-3 text-right">Quick Tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/40">
                {examSpecs.map((item, idx) => (
                  <tr key={idx} className="hover:bg-purple-800/20 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">
                      {language === 'hi' ? item.examHi : item.exam}
                    </td>
                    <td className="py-3.5 px-3 text-purple-200 font-semibold">
                      {item.photoSize}
                    </td>
                    <td className="py-3.5 px-3 text-purple-200 font-semibold">
                      {item.sigSize}
                    </td>
                    <td className="py-3.5 px-3 text-purple-300/80 text-xs">
                      {language === 'hi' ? item.notesHi : item.notes}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectTool(item.tool)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm inline-flex items-center gap-1"
                      >
                        <span>{language === 'hi' ? 'फोटो बनाएं' : 'Resize Now'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AdSense Placement Area (Clearly separated from action/download buttons) */}
      <AdSenseBanner slotType="leaderboard" onOpenAdGuide={onOpenAdGuide} />

      {/* Why AI Photo Lab & Privacy Architecture Section */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'AI Photo Lab को क्यों चुनें?' : 'Why Choose AI Photo Lab?'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {language === 'hi'
                ? 'पारंपरिक ऑनलाइन टूल्स बनाम हमारा शून्य-अपलोड क्लाइंट-साइड दृष्टिकोण'
                : 'Traditional online converters vs our zero-upload client-side approach'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {language === 'hi' ? '100% शून्य सर्वर अपलोड' : 'Zero Server Uploads'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'आपकी तस्वीरें आपके डिवाइस की मेमोरी में ही प्रोसेस होती हैं। कोई भी रिमोट सर्वर आपकी फाइलों को कभी नहीं देख सकता।'
                  : 'Files never leave your phone or laptop. Every pixel manipulation executes inside the sandbox of your browser.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {language === 'hi' ? 'असीमित और बिजली जैसी तेज गति' : 'Unlimited & Instant Speed'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'अपलोड व डाउनलोड कतार के बिना तुरंत काम करता है। इंटरनेट धीमा होने पर भी तेज प्रतिक्रिया।'
                  : 'Zero queue times and zero upload latency. Processing takes milliseconds even on large camera captures.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                {language === 'hi' ? 'सरकारी फॉर्म विशेष' : 'Govt Exam & Visa Ready'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'SSC, UPSC, रेलवे और पासपोर्ट पोर्टलों के लिए 20KB-50KB सीमा और 35x45mm माप का सटीक पालन।'
                  : 'Pre-calibrated 35x45mm and 2x2 inch standards with strict 20KB-50KB constraint algorithms.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutorials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {t.tutorialsSection.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t.tutorialsSection.subtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigateView('tutorials')}
            className="mt-3 sm:mt-0 text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t.tutorialsSection.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTutorials.map((tut) => {
            const title = language === 'hi' ? tut.titleHi : tut.titleEn;
            const desc = language === 'hi' ? tut.descriptionHi : tut.descriptionEn;
            const cat = language === 'hi' ? tut.categoryHi : tut.category;

            return (
              <div
                key={tut.id}
                onClick={() => onSelectTutorial(tut)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                      {cat}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {tut.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                  <span>{t.tutorialsSection.readMore}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white border-t border-slate-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {language === 'hi' ? 'फोटो टूल्स व सुरक्षा से संबंधित सामान्य सवाल' : 'Everything you need to know about our browser tools'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center shrink-0">
                    Q
                  </span>
                  <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed pl-7">
                  {language === 'hi' ? faq.aHi : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
