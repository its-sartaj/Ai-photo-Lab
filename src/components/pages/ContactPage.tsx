import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Mail, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react';

import { PageView } from '../../types';

interface ContactPageProps {
  onNavigateView?: (view: PageView) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateView }) => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  const contactEmail = 'apextech.servicess@gmail.com';
  const supportEmail = 'support@aiphotolab.publicvm.com';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5 text-purple-600" />
          <span>{language === 'hi' ? 'संपर्क करें' : 'Get in Touch'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'हमसे संपर्क करें' : 'Contact Us'}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          {language === 'hi'
            ? 'क्या आपके पास कोई सुझाव, प्रश्न या बग रिपोर्ट है? हमें ईमेल भेजें, हम सहायता के लिए तैयार हैं।'
            : 'Have a feature suggestion, question, or bug report? Reach out to us directly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Details Card */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-purple-100 p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {language === 'hi' ? 'आधिकारिक संपर्क ईमेल' : 'Official Support Email'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'वेबसाइट सुधार, ट्यूटोरियल या व्यावसायिक पूछताछ के लिए सीधे हमारे ईमेल पर संपर्क करें:'
                : 'For inquiries, tool suggestions, feedback, or corrections, write to:'}
            </p>
          </div>

          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[11px] text-purple-600 font-semibold uppercase">
                {language === 'hi' ? 'ईमेल आईडी' : 'Direct Email'}
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-900 truncate block group-hover:text-purple-700">
                {contactEmail}
              </span>
            </div>
          </a>

          <div className="space-y-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">
                  {language === 'hi' ? 'प्रतिक्रिया समय:' : 'Response Time:'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'हम सामान्यत: 24-48 घंटों के भीतर सभी ईमेल का उत्तर देते हैं।'
                    : 'We typically respond to inquiries within 24 to 48 hours.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">
                  {language === 'hi' ? 'गोपनीयता:' : 'Privacy Assurance:'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'आपकी ईमेल आईडी का उपयोग केवल उत्तर देने के लिए किया जाता है, किसी मार्केटिंग के लिए नहीं।'
                    : 'Your email address is kept strictly confidential and never shared.'}
                </p>
              </div>
            </div>

            {/* FAQ Help Desk link */}
            <div className="pt-3 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">
                    {language === 'hi' ? 'त्वरित सहायता केंद्र (FAQ Desk)' : 'Quick Help Desk & FAQs'}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {language === 'hi'
                      ? 'सरकारी परीक्षा फोटो साइज, सिग्नेचर नियमों और सामान्य प्रश्नों के तुरंत समाधान के लिए हमारे गाइड्स देखें।'
                      : 'Looking for immediate answers on exam photo criteria, DPI, or video compression?'}
                  </p>
                  {onNavigateView && (
                    <button
                      onClick={() => onNavigateView('tutorials')}
                      className="mt-2 text-purple-700 hover:text-purple-800 font-bold text-[11px] underline cursor-pointer"
                    >
                      {language === 'hi' ? '→ सामान्य प्रश्न व ट्यूटोरियल देखें' : '→ Browse FAQs & Tutorials'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'hi' ? 'संदेश प्राप्त हुआ!' : 'Message Received!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {language === 'hi'
                  ? 'आपका संदेश दर्ज कर लिया गया है। हम जल्द ही आपसे संपर्क करेंगे।'
                  : 'Thank you for reaching out. We appreciate your feedback.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors"
              >
                {language === 'hi' ? 'दूसरा संदेश भेजें' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'आपका नाम' : 'Your Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. John Doe'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'विषय' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'सुझाव, नया टूल या प्रश्न'
                      : 'Feature suggestion, feedback or bug'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'hi' ? 'संदेश' : 'Your Message'} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'अपना संदेश विस्तार से लिखें...'
                      : 'Type your message or questions here...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'hi' ? 'संदेश भेजें' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
