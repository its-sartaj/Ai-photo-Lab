import React, { useState } from 'react';
import { TUTORIALS_DATA } from '../../data/tutorialsData';
import { TutorialItem, ToolId } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { BookOpen, Clock, ArrowRight, Search, Sparkles } from 'lucide-react';

interface TutorialsListProps {
  onSelectTutorial: (tutorial: TutorialItem) => void;
  onOpenTool: (toolId: ToolId) => void;
}

export const TutorialsList: React.FC<TutorialsListProps> = ({
  onSelectTutorial,
  onOpenTool,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTutorials = TUTORIALS_DATA.filter((tut) => {
    const title = language === 'hi' ? tut.titleHi : tut.titleEn;
    const desc = language === 'hi' ? tut.descriptionHi : tut.descriptionEn;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || tut.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', labelEn: 'All Guides', labelHi: 'सभी गाइड्स' },
    { id: 'Optimization', labelEn: 'Optimization', labelHi: 'कंप्रेशन' },
    { id: 'Formats', labelEn: 'Formats', labelHi: 'फॉर्मेट्स (WebP/JPG)' },
    { id: 'Govt Forms', labelEn: 'Govt & Passport', labelHi: 'सरकारी फॉर्म' },
    { id: 'Technique', labelEn: 'Resizing & DPI', labelHi: 'रीसाइज और DPI' },
    { id: 'Privacy & Tech', labelEn: 'Privacy & Security', labelHi: 'सुरक्षा व तकनीक' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'द्विभाषी ट्यूटोरियल्स' : 'Bilingual Knowledge Base'}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.tutorialsSection.title}
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600">
          {t.tutorialsSection.subtitle}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/40'
              }`}
            >
              {language === 'hi' ? c.labelHi : c.labelEn}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'hi' ? 'गाइड खोजें...' : 'Search tutorials...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Tutorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tut) => {
          const title = language === 'hi' ? tut.titleHi : tut.titleEn;
          const desc = language === 'hi' ? tut.descriptionHi : tut.descriptionEn;
          const category = language === 'hi' ? tut.categoryHi : tut.category;

          return (
            <div
              key={tut.id}
              onClick={() => onSelectTutorial(tut)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                    {category}
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

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{t.tutorialsSection.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                {tut.relatedTool && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTool(tut.relatedTool!);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-medium transition-colors"
                  >
                    {language === 'hi' ? 'टूल खोलें' : 'Open Tool'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTutorials.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">
          {language === 'hi' ? 'कोई ट्यूटोरियल नहीं मिला।' : 'No tutorials matched your search.'}
        </div>
      )}
    </div>
  );
};
