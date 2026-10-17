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

  // Parse initial URL query params (?tool=... or ?view=... or ?tut=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toolParam = params.get('tool') as ToolId | null;
    const viewParam = params.get('view') as PageView | null;
    const tutId = params.get('tut');

    if (toolParam && ['compress', 'resize', 'convert', 'crop', 'passport', 'cutout', 'video-compress'].includes(toolParam)) {
      setActiveTool(toolParam);
      setCurrentView('tool');
    } else if (viewParam) {
      setCurrentView(viewParam);
    } else if (tutId) {
      const match = TUTORIALS_DATA.find((t) => t.id === tutId);
      if (match) {
        setSelectedTutorial(match);
        setCurrentView('tutorial-detail');
      }
    }
  }, []);

  // Update browser URL query without reload
  const updateUrl = (view: PageView, tool?: ToolId, tutId?: string) => {
    const url = new URL(window.location.href);
    url.search = '';
    if (view === 'tool' && tool) {
      url.searchParams.set('tool', tool);
    } else if (view === 'tutorial-detail' && tutId) {
      url.searchParams.set('tut', tutId);
    } else if (view !== 'home') {
      url.searchParams.set('view', view);
    }
    window.history.pushState({}, '', url.toString());
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
            <ContactPage />
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
