/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { BlogSection } from './components/BlogSection';
import { ResourcesSection } from './components/ResourcesSection';
import { AdminDashboard } from './components/AdminDashboard';
import { GraduationCap, ArrowUpRight, HelpCircle, Mail, MapPin } from 'lucide-react';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'home' | 'blog' | 'resources' | 'admin'>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { isLoading } = useApp();

  const handleSetView = (newView: 'home' | 'blog' | 'resources' | 'admin') => {
    // If we transition to blog, we might want to clear selected post unless specified
    if (newView !== 'blog') {
      setSelectedPostId(null);
    }
    setView(newView);
    window.scrollTo({ top: 0 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Initializing Academia...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-between">
      <div>
        {/* Responsive Premium Navbar */}
        <Navbar currentView={view} setView={handleSetView} />

        {/* Dynamic Route Rendering */}
        <main className="py-6">
          {view === 'home' && (
            <LandingPage setView={handleSetView} setSelectedPostId={setSelectedPostId} />
          )}
          {view === 'blog' && (
            <BlogSection selectedPostId={selectedPostId} setSelectedPostId={setSelectedPostId} />
          )}
          {view === 'resources' && (
            <ResourcesSection />
          )}
          {view === 'admin' && (
            <AdminDashboard />
          )}
        </main>
      </div>

      {/* Footer Section */}
      <footer className="bg-slate-900 border-t border-slate-800 text-white pt-16 pb-8 mt-12 rounded-t-[40px] overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Column 1: Brand descriptor */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                  <GraduationCap size={18} />
                </div>
                <span className="font-display font-bold tracking-tight text-sm uppercase">
                  LingoCraft
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                A professional, modern educational blog and model writing resource compiled to cultivate absolute grammar precision, cohesive writing styles, and technical workplace vocabulary.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 font-mono mb-4">
                Syllabus
              </span>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
                {['Grammar lessons', 'Vocabulary guides', 'Writing models', 'Idiom logs'].map((link, idx) => (
                  <li key={idx}>
                    <button onClick={() => handleSetView('blog')} className="hover:text-brand-400 transition-colors cursor-pointer flex items-center gap-1">
                      {link}
                      <ArrowUpRight size={12} className="opacity-40" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Academic Curricula */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 font-mono mb-4">
                Curricula focus
              </span>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
                {['IELTS Academic Task 1 & 2', 'TOEFL iBT Writing', 'C-Suite Business Letters', 'Corporate Correspondence'].map((link, idx) => (
                  <li key={idx}>
                    <button onClick={() => handleSetView('resources')} className="hover:text-brand-400 transition-colors cursor-pointer flex items-center gap-1">
                      {link}
                      <ArrowUpRight size={12} className="opacity-40" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Quick Contact */}
            <div className="space-y-3.5 text-xs text-slate-300">
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 font-mono mb-4">
                Office Coordinates
              </span>
              <div className="flex items-center gap-2.5 font-medium">
                <MapPin size={14} className="text-brand-400" />
                <span>London Academic Square, WC1A 2TH</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <Mail size={14} className="text-brand-400" />
                <span>faculty@lingocraft.edu</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <HelpCircle size={14} className="text-brand-400" />
                <span>Demo Student: student123</span>
              </div>
            </div>

          </div>

          {/* Footer Bottom copyright and disclaimer */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>© 2026 LingoCraft Academic Systems. All rights reserved.</span>
            <div className="flex items-center gap-2 text-brand-400/80">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Safe Checkout Demonstration Sandbox</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
