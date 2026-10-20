import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PageView, ToolId, TutorialItem } from './types';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AdSenseBanner } from './components/AdSenseBanner';
import { TUTORIALS_DATA } from './data/tutorialsData';
import {
  Sliders,
  Maximize2,
  RefreshCw,
  Crop,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Loader2,
  Film,
} from 'lucide-react';

// Lazy-load tools for high performance and minimal initial bundle size
const CompressorTool = lazy(() => import('./components/tools/CompressorTool').then(m => ({ default: m.CompressorTool })));
const ResizerTool = lazy(() => import('./components/tools/ResizerTool').then(m => ({ default: m.ResizerTool })));
const ConverterTool = lazy(() => import('./components/tools/ConverterTool').then(m => ({ default: m.ConverterTool })));
const CropperTool = lazy(() => import('./components/tools/CropperTool').then(m => ({ default: m.CropperTool })));
const PassportTool = lazy(() => import('./components/tools/PassportTool').then(m => ({ default: m.PassportTool })));
const CutoutTool = lazy(() => import('./components/tools/CutoutTool').then(m => ({ default: m.CutoutTool })));
const VideoCompressorTool = lazy(() => import('./components/tools/VideoCompressorTool').then(m => ({ default: m.VideoCompressorTool })));

// Lazy-load informational & secondary pages
const TutorialsList = lazy(() => import('./components/tutorials/TutorialsList').then(m => ({ default: m.TutorialsList })));
const TutorialDetail = lazy(() => import('./components/tutorials/TutorialDetail').then(m => ({ default: m.TutorialDetail })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import('./components/pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const AdSenseGuideModal = lazy(() => import('./components/pages/AdSenseGuideModal').then(m => ({ default: m.AdSenseGuideModal })));

function ToolLoadingFallback() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 animate-spin">
        <Loader2 className="w-6 h-6" />
      </div>
      <div className="text-sm font-semibold text-slate-700 animate-pulse">
        Loading AI Photo Lab Engine...
      </div>
    </div>
  );
}

function MainApp() {
  const { language, t } = useLanguage();
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeTool, setActiveTool] = useState<ToolId>('compress');
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialItem | null>(null);
  const [isAdGuideOpen, setIsAdGuideOpen] = useState(false);

  // Parse URL query params and handle browser back/forward navigation
  useEffect(() => {
    const syncFromUrl = () => {
      const pathSegment = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool') as ToolId | null;
      const viewParam = params.get('view') as PageView | null;
      const tutId = params.get('tut');

      // 1. Path-based clean routing (/compress/, /passport-photo/, etc.)
      if (pathSegment === 'compress') {
        setActiveTool('compress');
        setCurrentView('tool');
      } else if (pathSegment === 'passport-photo' || pathSegment === 'passport') {
        setActiveTool('passport');
        setCurrentView('tool');
      } else if (pathSegment === 'resize') {
        setActiveTool('resize');
        setCurrentView('tool');
      } else if (pathSegment === 'video-compress') {
        setActiveTool('video-compress');
        setCurrentView('tool');
      } else if (pathSegment === 'cutout') {
        setActiveTool('cutout');
        setCurrentView('tool');
      } else if (pathSegment === 'convert') {
        setActiveTool('convert');
        setCurrentView('tool');
      } else if (pathSegment === 'crop') {
        setActiveTool('crop');
        setCurrentView('tool');
      } else if (['about', 'contact', 'privacy', 'terms', 'disclaimer', 'tutorials'].includes(pathSegment)) {
        setCurrentView(pathSegment as PageView);
      }
      // 2. Query param based routing fallback
      else if (toolParam && ['compress', 'resize', 'convert', 'crop', 'passport', 'cutout', 'video-compress'].includes(toolParam)) {
        setActiveTool(toolParam);
        setCurrentView('tool');
      } else if (tutId) {
        const match = TUTORIALS_DATA.find((t) => t.id === tutId);
        if (match) {
          setSelectedTutorial(match);
          setCurrentView('tutorial-detail');
        } else {
          setCurrentView('tutorials');
        }
      } else if (viewParam) {
        setCurrentView(viewParam);
      } else {
        setCurrentView('home');
      }
    };

    // Initial sync
    syncFromUrl();

    // Listen to browser Back/Forward buttons
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Dynamically update document title, description, and canonical link for Google SEO & crawlers
  useEffect(() => {
    let pageTitle = 'AI Photo Lab - Free Photo Compressor 20KB 50KB, Passport Photo Maker & BG Remover';
    let pageDesc = 'Free 100% private online photo tools: Compress images to 20KB, 50KB, 100KB for SSC, UPSC & Govt job forms. Passport size photo maker (3.5x4.5 cm), AI background remover, resizer & format converter.';
    let pageCanonical = 'https://www.aiphotolab.publicvm.com/';

    if (currentView === 'tool') {
      const toolMetadata: Record<ToolId, { titleEn: string; titleHi: string; descEn: string; descHi: string }> = {
        compress: {
          titleEn: 'Photo Compressor 20KB, 50KB, 100KB Online Free (SSC, UPSC) - AI Photo Lab',
          titleHi: 'फोटो कंप्रेसर 20KB, 50KB ऑनलाइन मुफ्त (SSC, UPSC फॉर्म) - AI Photo Lab',
          descEn: 'Compress JPG, PNG & WebP images to exact 20KB, 50KB, or 100KB file size online. 100% private in-browser compression without quality loss for government exam forms.',
          descHi: 'सरकारी फॉर्म व परीक्षाओं (SSC, UPSC, रेलवे) के लिए फोटो का साइज 20KB, 50KB या 100KB में कम करें। 100% मुफ्त और प्राइवेट।',
        },
        passport: {
          titleEn: 'Passport Size Photo Maker Online Free (3.5 x 4.5 cm, 2x2 inch) - AI Photo Lab',
          titleHi: 'पासपोर्ट साइज फोटो बनाएं ऑनलाइन फ्री (3.5 x 4.5 cm) - AI Photo Lab',
          descEn: 'Create official 3.5x4.5 cm passport size photos online for free. Add white/blue studio backgrounds, crop face, and generate 4x6 inch printable sheets.',
          descHi: 'ऑनलाइन पासपोर्ट साइज फोटो (3.5 × 4.5 सेमी) बनाएं। सफेद/नीला बैकग्राउंड जोड़ें और 4x6 प्रिंटेबल शीट मुफ्त में डाउनलोड करें।',
        },
        resize: {
          titleEn: 'Image Resizer Online - Resize Photo in Pixels, CM, MM & Inches - AI Photo Lab',
          titleHi: 'इमेज रिसाइजर ऑनलाइन - फोटो का साइज पिक्सल, cm और mm में बदलें - AI Photo Lab',
          descEn: 'Resize image dimensions online in cm, mm, inches, and px with aspect ratio lock. Perfect for signatures (140x60 px) and online exam portals.',
          descHi: 'फोटो और सिग्नेचर का साइज पिक्सल (px), सेमी (cm) और मिमी (mm) में बदलें। सरकारी फॉर्म और पोर्टल के लिए सटीक माप।',
        },
        convert: {
          titleEn: 'WebP to JPG, PNG Converter Online Free - AI Photo Lab',
          titleHi: 'WebP से JPG और PNG कन्वर्टर ऑनलाइन फ्री - AI Photo Lab',
          descEn: 'Convert WebP to JPG, PNG to JPG, SVG to PNG instantly online. 100% client-side privacy with batch support and zero server uploads.',
          descHi: 'WebP को JPG या PNG में सेकंडों में बदलें। बिना सर्वर अपलोड 100% सुरक्षित और मुफ्त फॉर्मेट कनवर्टर।',
        },
        crop: {
          titleEn: 'Image Cropper Online Free - Crop Photos to 1:1, 4:5, 16:9 - AI Photo Lab',
          titleHi: 'इमेज क्रॉपर ऑनलाइन फ्री - फोटो क्रॉप करें - AI Photo Lab',
          descEn: 'Crop photos online with precise aspect ratios (1:1 Square, 4:5 Portrait, 16:9 Banner) and custom freeform selection in your browser.',
          descHi: 'अपनी फोटो को मनचाहे आकार (1:1, 4:5, 16:9) में आसानी से क्रॉप करें।',
        },
        cutout: {
          titleEn: 'AI Background Remover Free Online - 100% Private - AI Photo Lab',
          titleHi: 'फ्री AI बैकग्राउंड रिमूवर ऑनलाइन - AI Photo Lab',
          descEn: 'Remove background from photos automatically using on-device browser AI. 100% private with zero server uploads, download crisp transparent PNGs.',
          descHi: 'बिना सर्वर अपलोड के सीधे अपने फोन या कंप्यूटर में फोटो का बैकग्राउंड हटाएं। 100% सुरक्षित और पारदर्शी PNG पाएं।',
        },
        'video-compress': {
          titleEn: 'Video Compressor Online Free - Compress MP4 & WebM in Browser - AI Photo Lab',
          titleHi: 'वीडियो कंप्रेसर ऑनलाइन फ्री - MP4 साइज कम करें - AI Photo Lab',
          descEn: 'Compress video files online directly in your browser. Reduce MP4 file size for WhatsApp, Discord, and email without uploading to remote servers.',
          descHi: 'ब्राउज़र में सीधे MP4 और WebM वीडियो फाइल साइज कम करें। व्हाट्सएप और ईमेल के लिए बिना सर्वर अपलोड कंप्रेस करें।',
        },
      };

      const meta = toolMetadata[activeTool];
      if (meta) {
        pageTitle = language === 'hi' ? meta.titleHi : meta.titleEn;
        pageDesc = language === 'hi' ? meta.descHi : meta.descEn;
        const slug = activeTool === 'passport' ? 'passport-photo' : activeTool;
        pageCanonical = `https://www.aiphotolab.publicvm.com/${slug}/`;
      }
    } else if (currentView === 'tutorial-detail' && selectedTutorial) {
      pageTitle = `${language === 'hi' ? selectedTutorial.titleHi : selectedTutorial.titleEn} - AI Photo Lab`;
      pageDesc = language === 'hi' ? selectedTutorial.descriptionHi : selectedTutorial.descriptionEn;
      pageCanonical = `https://www.aiphotolab.publicvm.com/?tut=${selectedTutorial.id}`;
    } else if (currentView === 'tutorials') {
      pageTitle = language === 'hi'
        ? 'फोटो एडिटिंग और कंप्रेशन गाइड्स (Hindi Guides) - AI Photo Lab'
        : 'Photo Editing & Image Compression Guides - AI Photo Lab';
      pageDesc = 'Comprehensive step-by-step tutorials on compressing photos to 20KB/50KB, government exam passport specifications, and format optimization.';
      pageCanonical = 'https://www.aiphotolab.publicvm.com/tutorials/';
    } else if (currentView === 'about') {
      pageTitle = 'About AI Photo Lab - 100% Client-Side Private Photo Tools';
      pageCanonical = 'https://www.aiphotolab.publicvm.com/about/';
    } else if (currentView === 'privacy') {
      pageTitle = 'Privacy Policy - Zero Server Uploads | AI Photo Lab';
      pageCanonical = 'https://www.aiphotolab.publicvm.com/privacy/';
    } else if (currentView === 'terms') {
      pageTitle = 'Terms of Service | AI Photo Lab';
      pageCanonical = 'https://www.aiphotolab.publicvm.com/terms/';
    } else if (currentView === 'contact') {
      pageTitle = 'Contact Support | AI Photo Lab';
      pageCanonical = 'https://www.aiphotolab.publicvm.com/contact/';
    } else if (currentView === 'disclaimer') {
      pageTitle = language === 'hi'
        ? 'अस्वीकरण (Disclaimer) - गैर-सरकारी उपकरण | AI Photo Lab'
        : 'Disclaimer - Independent Utility Tool | AI Photo Lab';
      pageDesc = 'AI Photo Lab is an independent browser-based image utility and is not affiliated, associated, or endorsed by any government agency (SSC, UPSC, NTA, IBPS).';
      pageCanonical = 'https://www.aiphotolab.publicvm.com/disclaimer/';
    }

    // Set Document Title
    document.title = pageTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', pageDesc);
    }

    // Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', pageCanonical);
    }

    // Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', pageCanonical);
  }, [currentView, activeTool, selectedTutorial, language]);

  // Update browser URL query without reload
  const updateUrl = (view: PageView, tool?: ToolId, tutId?: string) => {
    let newPath = '/';
    const params = new URLSearchParams();
    const existingLang = new URLSearchParams(window.location.search).get('lang');

    if (view === 'tool' && tool) {
      const slug = tool === 'passport' ? 'passport-photo' : tool;
      newPath = `/${slug}/`;
    } else if (view === 'tutorial-detail' && tutId) {
      newPath = '/tutorials/';
      params.set('tut', tutId);
    } else if (view !== 'home') {
      newPath = `/${view}/`;
    }

    if (existingLang || language === 'hi') {
      params.set('lang', existingLang || language);
    }

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    window.history.pushState({}, '', `${newPath}${queryStr}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (toolId: ToolId) => {
    setActiveTool(toolId);
    setCurrentView('tool');
    updateUrl('tool', toolId);
  };

  const handleNavigateView = (view: PageView) => {
    setCurrentView(view);
    updateUrl(view);
  };

  const handleSelectTutorial = (tutorial: TutorialItem) => {
    setSelectedTutorial(tutorial);
    setCurrentView('tutorial-detail');
    updateUrl('tutorial-detail', undefined, tutorial.id);
  };

  const toolsTabList = [
    { id: 'compress' as ToolId, name: t.tools.compress.name, icon: Sliders },
    { id: 'video-compress' as ToolId, name: t.tools['video-compress'].name, icon: Film },
    { id: 'resize' as ToolId, name: t.tools.resize.name, icon: Maximize2 },
    { id: 'convert' as ToolId, name: t.tools.convert.name, icon: RefreshCw },
    { id: 'crop' as ToolId, name: t.tools.crop.name, icon: Crop },
    { id: 'passport' as ToolId, name: t.tools.passport.name, icon: ShieldCheck },
    { id: 'cutout' as ToolId, name: t.tools.cutout.name, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        currentView={currentView}
        activeTool={activeTool}
        onNavigateView={handleNavigateView}
        onSelectTool={handleSelectTool}
        onOpenAdGuide={() => setIsAdGuideOpen(true)}
      />

      <main className="flex-1">
        {/* If inside tool view: render quick tool-switcher bar */}
        {currentView === 'tool' && (
          <div className="bg-white border-b border-purple-100 shadow-xs py-3 px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <button
                onClick={() => handleNavigateView('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'होम' : 'Home'}</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
                {toolsTabList.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTool === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTool(tab.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View Router with Suspense */}
        {currentView === 'home' && (
          <HomePage
            onSelectTool={handleSelectTool}
            onSelectTutorial={handleSelectTutorial}
            onNavigateView={handleNavigateView}
            onOpenAdGuide={() => setIsAdGuideOpen(true)}
          />
        )}

        {currentView === 'tool' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <div key={activeTool}>
              {activeTool === 'compress' && <CompressorTool />}
              {activeTool === 'resize' && <ResizerTool />}
              {activeTool === 'convert' && <ConverterTool />}
              {activeTool === 'crop' && <CropperTool />}
              {activeTool === 'passport' && <PassportTool />}
              {activeTool === 'cutout' && <CutoutTool />}
              {activeTool === 'video-compress' && <VideoCompressorTool />}

              {/* In-tool separated compliant AdSense slot */}
              <AdSenseBanner slotType="in-content" onOpenAdGuide={() => setIsAdGuideOpen(true)} />
            </div>
          </Suspense>
        )}

        {currentView === 'tutorials' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <div>
              <TutorialsList
                onSelectTutorial={handleSelectTutorial}
                onOpenTool={handleSelectTool}
              />
              <AdSenseBanner slotType="in-content" onOpenAdGuide={() => setIsAdGuideOpen(true)} />
            </div>
          </Suspense>
        )}

        {currentView === 'tutorial-detail' && selectedTutorial && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <div>
              <TutorialDetail
                tutorial={selectedTutorial}
                onBack={() => handleNavigateView('tutorials')}
                onOpenTool={handleSelectTool}
              />
              <AdSenseBanner slotType="in-content" onOpenAdGuide={() => setIsAdGuideOpen(true)} />
            </div>
          </Suspense>
        )}

        {currentView === 'about' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <AboutPage />
          </Suspense>
        )}

        {currentView === 'contact' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <ContactPage onNavigateView={handleNavigateView} />
          </Suspense>
        )}

        {currentView === 'privacy' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <PrivacyPolicyPage />
          </Suspense>
        )}

        {currentView === 'terms' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <TermsPage />
          </Suspense>
        )}

        {currentView === 'disclaimer' && (
          <Suspense fallback={<ToolLoadingFallback />}>
            <DisclaimerPage />
          </Suspense>
        )}
      </main>

      <Footer
        onNavigateView={handleNavigateView}
        onSelectTool={handleSelectTool}
        onOpenAdGuide={() => setIsAdGuideOpen(true)}
      />

      {/* Guide Modal (Lazy Loaded) */}
      {isAdGuideOpen && (
        <Suspense fallback={null}>
          <AdSenseGuideModal
            isOpen={isAdGuideOpen}
            onClose={() => setIsAdGuideOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
