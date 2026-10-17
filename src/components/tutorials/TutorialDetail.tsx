import React from 'react';
import { TutorialItem, ToolId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TutorialDetailProps {
  tutorial: TutorialItem;
  onBack: () => void;
  onOpenTool: (toolId: ToolId) => void;
}

export const TutorialDetail: React.FC<TutorialDetailProps> = ({
  tutorial,
  onBack,
  onOpenTool,
}) => {
  const { language, t } = useLanguage();

  const title = language === 'hi' ? tutorial.titleHi : tutorial.titleEn;
  const category = language === 'hi' ? tutorial.categoryHi : tutorial.category;
  const content = language === 'hi' ? tutorial.contentHi : tutorial.contentEn;

  // Simple clean markdown-to-HTML parser for tutorials
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-purple-600 rounded-full inline-block"></span>
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Horizontal rule
      if (trimmed === '---') {
        elements.push(<hr key={index} className="my-8 border-slate-200" />);
        return;
      }

      // Markdown table handling
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        // Skip separator row like | :--- | :--- |
        if (!trimmed.includes('---')) {
          const cells = trimmed
            .split('|')
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
            .map((c) => c.trim().replace(/\*\*(.*?)\*\*/g, '$1'));
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        inTable = false;
        // render table collected so far
        if (tableRows.length > 0) {
          const header = tableRows[0];
          const body = tableRows.slice(1);
          elements.push(
            <div key={`table-${index}`} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-purple-50/80 text-purple-900 font-bold border-b border-purple-100">
                  <tr>
                    {header.map((col, cIdx) => (
                      <th key={cIdx} className="px-4 py-3">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {body.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Bullet list items
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
        elements.push(
          <div key={index} className="flex items-start gap-2.5 my-2 text-slate-700 text-sm md:text-base leading-relaxed pl-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
            <span
              dangerouslySetInnerHTML={{
                __html: bulletText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
          </div>
        );
        return;
      }

      // Numbered list items
      if (/^\d+\.\s+/.test(trimmed)) {
        const numText = trimmed.replace(/^\d+\.\s+/, '');
        const num = trimmed.match(/^(\d+)\./)?.[1] || '1';
        elements.push(
          <div key={index} className="flex items-start gap-3 my-2 text-slate-700 text-sm md:text-base leading-relaxed pl-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {num}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: numText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
          </div>
        );
        return;
      }

      // Standard paragraphs
      if (trimmed.length > 0) {
        elements.push(
          <p
            key={index}
            className="my-3 text-slate-700 text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: trimmed
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-purple-700 font-mono text-xs">$1</code>'),
            }}
          />
        );
      }
    });

    return elements;
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.tutorialsSection.backToTutorials}</span>
      </button>

      {/* Hero Meta */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {category}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tutorial.readTime}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {tutorial.date}
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            100% Free & Verified
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
          {title}
        </h1>

        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          {language === 'hi' ? tutorial.descriptionHi : tutorial.descriptionEn}
        </p>

        {tutorial.relatedTool && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs text-slate-500 font-medium">
              {language === 'hi' ? 'इस ट्यूटोरियल से जुड़ा टूल तुरंत आज़माएं:' : 'Try the matching tool immediately:'}
            </div>
            <button
              onClick={() => onOpenTool(tutorial.relatedTool!)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all cursor-pointer"
            >
              <span>{language === 'hi' ? 'टूल खोलें' : 'Open Tool'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Article Body */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm">
        {renderFormattedContent(content)}
      </div>

      {/* Bottom CTA */}
      {tutorial.relatedTool && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-center shadow-lg flex flex-col items-center">
          <h3 className="text-lg md:text-xl font-bold mb-2">
            {language === 'hi'
              ? 'क्या आप अपनी फोटो को तुरंत एडिट करना चाहते हैं?'
              : 'Ready to optimize your photo now?'}
          </h3>
          <p className="text-xs md:text-sm text-purple-200 max-w-md mb-4">
            {language === 'hi'
              ? 'बिना किसी सॉफ्टवेयर या शुल्क के, सीधे अपने ब्राउज़र में सुरक्षित प्रोसेस करें।'
              : 'Zero signup, completely free, and 100% client-side privacy.'}
          </p>
          <button
            onClick={() => onOpenTool(tutorial.relatedTool!)}
            className="px-6 py-3 rounded-xl bg-white text-purple-800 hover:bg-purple-50 font-bold text-sm shadow transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'hi' ? 'टूल पर जाएं' : 'Launch Tool'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </article>
  );
};
