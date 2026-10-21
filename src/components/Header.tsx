import React, { useState } from 'react';
import { PageView, ToolId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import {
  Camera,
  ChevronDown,
  Globe,
  Menu,
  X,
  Sliders,
  Maximize2,
  RefreshCw,
  Crop,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Info,
  Mail,
  Film,
} from 'lucide-react';

interface HeaderProps {
  currentView: PageView;
  activeTool: ToolId;
  onNavigateView: (view: PageView) => void;
  onSelectTool: (toolId: ToolId) => void;
  onOpenAdGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeTool,
  onNavigateView,
  onSelectTool,
  onOpenAdGuide,
}) => {
  const { language, toggleLanguage, setLanguage, t } = useLanguage();
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toolsList = [
    { id: 'compress', name: t.tools.compress.name, icon: Sliders, badge: t.tools.compress.badge },
    { id: 'video-compress', name: t.tools['video-compress'].name, icon: Film, badge: t.tools['video-compress'].badge },
    { id: 'resize', name: t.tools.resize.name, icon: Maximize2, badge: t.tools.resize.badge },
    { id: 'convert', name: t.tools.convert.name, icon: RefreshCw, badge: t.tools.convert.badge },
    { id: 'crop', name: t.tools.crop.name, icon: Crop, badge: t.tools.crop.badge },
    { id: 'passport', name: t.tools.passport.name, icon: ShieldCheck, badge: t.tools.passport.badge },
    { id: 'cutout', name: t.tools.cutout.name, icon: Sparkles, badge: t.tools.cutout.badge },
  ];

  const handleToolClick = (id: ToolId) => {
    onSelectTool(id);
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleViewClick = (view: PageView) => {
    onNavigateView(view);
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleViewClick('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl text-inherit no-underline"
          >
            <Logo variant="icon" size={40} className="transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  AI Photo Lab
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">
                  Free
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 -mt-0.5 font-medium">
                {language === 'hi' ? 'मुफ्त ऑनलाइन फोटो टूल्स' : 'Edit • Resize • Compress'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleViewClick('home')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.home}
            </button>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'tool'
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{t.nav.tools}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {toolsDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'उपलब्ध टूल्स' : 'Client-Side Tools'}
                  </div>
                  {toolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleToolClick(tool.id as ToolId)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors hover:bg-purple-50/70 ${
                          activeTool === tool.id && currentView === 'tool'
                            ? 'text-purple-700 font-bold bg-purple-50'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{tool.name}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                          {tool.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => handleViewClick('tutorials')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'tutorials' || currentView === 'tutorial-detail'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.tutorials}
            </button>

            <button
              onClick={() => handleViewClick('about')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'about'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.about}
            </button>

            <button
              onClick={() => handleViewClick('contact')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'contact'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'hi'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-200"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-purple-100 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => handleViewClick('home')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left ${
                currentView === 'home' ? 'bg-purple-100 text-purple-800' : 'text-slate-700'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleViewClick('tutorials')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left ${
                currentView === 'tutorials' ? 'bg-purple-100 text-purple-800' : 'text-slate-700'
              }`}
            >
              {t.nav.tutorials}
            </button>
            <button
              onClick={() => handleViewClick('about')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left ${
                currentView === 'about' ? 'bg-purple-100 text-purple-800' : 'text-slate-700'
              }`}
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleViewClick('contact')}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left ${
                currentView === 'contact' ? 'bg-purple-100 text-purple-800' : 'text-slate-700'
              }`}
            >
              {t.nav.contact}
            </button>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t.nav.tools}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {toolsList.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id as ToolId)}
                  className={`p-2 rounded-xl text-left border text-xs font-medium transition-all ${
                    activeTool === tool.id && currentView === 'tool'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
