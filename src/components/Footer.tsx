import React from 'react';
import { PageView, ToolId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import { Camera, ShieldCheck, Mail, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigateView: (view: PageView) => void;
  onSelectTool: (toolId: ToolId) => void;
  onOpenAdGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateView,
  onSelectTool,
  onOpenAdGuide,
}) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Top Banner: Local Processing Guarantee */}
      <div className="bg-purple-950/70 border-b border-purple-900/50 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs md:text-sm text-purple-200 text-center font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.footer.localProcessingBadge}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigateView('home')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigateView('home');
                }
              }}
              aria-label="AI Photo Lab Home"
              className="flex items-center gap-2.5 cursor-pointer group inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl"
            >
              <Logo variant="icon" size={38} className="transition-transform group-hover:scale-105" />
              <span className="font-extrabold text-xl text-white tracking-tight group-hover:text-purple-400 transition-colors">
                AI Photo Lab
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="pt-2">
              <a
                href="mailto:apextech.servicess@gmail.com"
                className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>apextech.servicess@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTool('compress')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.tools.compress.name}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('resize')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.tools.resize.name}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('convert')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.tools.convert.name}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('crop')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.tools.crop.name}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('passport')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.tools.passport.name}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('cutout')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.tools.cutout.name}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('video-compress')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left text-purple-300 font-semibold"
                >
                  {t.tools['video-compress'].name}
                </button>
              </li>
            </ul>
          </div>

          {/* Guides & Tutorials */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t.footer.guides}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateView('tutorials')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hi' ? 'फोटो कंप्रेशन गाइड' : 'Compression Guide'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('tutorials')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hi' ? 'सरकारी फॉर्म फोटो गाइड' : 'Govt Exam Photo Specs'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('tutorials')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hi' ? 'WebP vs JPG vs PNG' : 'WebP vs JPG vs PNG'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('tutorials')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'hi' ? 'प्रिंटिंग DPI गाइड' : 'DPI & Print Resolution'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t.footer.legal}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateView('about')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('contact')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('privacy')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.nav.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('terms')}
                  className="hover:text-purple-400 transition-colors cursor-pointer text-left"
                >
                  {t.nav.terms}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © AI Photo Lab. {t.footer.allRights}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fast • Private • Free Forever</span>
            <span>•</span>
            <span>English / हिंदी</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
