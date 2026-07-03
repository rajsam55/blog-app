/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PremiumResource } from '../types';
import { StripeModal } from './StripeModal';
import { AuthModal } from './AuthModal';
import { Download, Lock, Unlock, Sparkles, BookOpen, GraduationCap, FileText, CheckCircle, ShieldAlert, ArrowRight, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ResourcesSection: React.FC = () => {
  const { resources, currentUser, isResourceUnlocked } = useApp();
  const [selectedResource, setSelectedResource] = useState<PremiumResource | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [readerResource, setReaderResource] = useState<PremiumResource | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleUnlockClick = (resource: PremiumResource) => {
    setAlertMessage(null);
    if (!currentUser) {
      setAlertMessage('Please log in or sign up first to access premium models and process payments.');
      setIsAuthOpen(true);
      return;
    }

    if (isResourceUnlocked(resource.id)) {
      // Already unlocked, open reader
      setReaderResource(resource);
    } else {
      // Trigger Stripe checkout
      setSelectedResource(resource);
      setIsCheckoutOpen(true);
    }
  };

  const handleDownloadFile = (resource: PremiumResource) => {
    if (!currentUser || !isResourceUnlocked(resource.id)) return;

    // Craft a highly formatted, professional plain text document representing the essay/report
    const headerBorder = '='.repeat(60);
    const textContent = `${headerBorder}\nLINGOCRAFT PREMIUM ACADEMIC RESOURCE PORTAL\n${headerBorder}\n\nTITLE: ${resource.title}\nCATEGORY: ${resource.type}\nLEVEL: ${resource.level}\nWORD COUNT: ${resource.wordCount}\nDATE ACCESSED: ${new Date().toISOString().split('T')[0]}\nSTUDENT LICENSE: ${currentUser.email}\n\n${headerBorder}\nDOCUMENT CONTENT\n${headerBorder}\n\n${resource.content}\n\n${headerBorder}\nEnd of licensed document. Created by LingoCraft Education Systems.\n${headerBorder}`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Sanitize title for filename
    const sanitizedTitle = resource.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_+|_+$)/g, '');
    
    link.href = url;
    link.download = `lingocraft_${sanitizedTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePaymentSuccess = () => {
    // Automatically open the reading panel of the newly unlocked resource
    if (selectedResource) {
      setReaderResource(selectedResource);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-mono">
          Model Documents
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2">
          Academic Writing & Executive Portfolios
        </h1>
        <p className="text-slate-500 text-sm mt-3 font-medium">
          Only logged-in users are permitted to acquire and download verified model writing. Study real Band 9.0 templates annotated by certified examiners.
        </p>
      </div>

      {alertMessage && (
        <div className="max-w-2xl mx-auto flex gap-3 p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl text-xs font-medium leading-relaxed shadow-sm">
          <ShieldAlert className="shrink-0 mt-0.5" size={16} />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Resources Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((res) => {
          const unlocked = isResourceUnlocked(res.id);
          return (
            <div
              key={res.id}
              className="group bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative"
            >
              {/* Top Banner Tag */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-block px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {res.type}
                  </span>
                  
                  {unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1 px-2.5 border border-emerald-100 rounded-full">
                      <Unlock size={10} />
                      Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 py-1 px-2.5 border border-slate-100 rounded-full">
                      <Lock size={10} />
                      Premium
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-950 tracking-tight leading-snug group-hover:text-brand-600 transition-colors">
                  {res.title}
                </h3>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">
                  {res.description}
                </p>

                {/* Technical Meta Pills */}
                <div className="flex gap-2.5 mt-5">
                  <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-50 text-[10px] font-semibold text-slate-400">
                    {res.wordCount} words
                  </div>
                  <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-50 text-[10px] font-semibold text-slate-400">
                    {res.level}
                  </div>
                </div>
              </div>

              {/* Purchase Card Footer / Trigger */}
              <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                    Acquisition Cost
                  </span>
                  <span className="text-lg font-display font-extrabold text-slate-900 block mt-1">
                    ${res.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleUnlockClick(res)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-md ${
                    unlocked
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/10'
                  }`}
                >
                  {unlocked ? (
                    <>
                      <Eye size={14} />
                      Read & Download
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Unlock Now
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Unlocked Document Reader side overlay panel */}
      <AnimatePresence>
        {readerResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-0 md:p-4">
            {/* Background blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReaderResource(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Document Drawer Canvas */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full md:h-[calc(100vh-32px)] bg-white border-l border-slate-200/80 rounded-none md:rounded-3xl shadow-2xl z-10 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 md:p-8 border-b border-slate-200/80 flex justify-between items-center bg-slate-50 rounded-t-none md:rounded-t-3xl">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                    Licensed Academic File • {readerResource.type}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-950 tracking-tight leading-tight">
                    {readerResource.title}
                  </h3>
                </div>
                <button
                  onClick={() => setReaderResource(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white border border-slate-200 rounded-full transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Reader Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar space-y-6">
                <div className="flex gap-4 p-4 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-semibold">
                  <CheckCircle className="shrink-0 text-emerald-500" size={16} />
                  <div>
                    <span>Authorized Student License Active.</span>
                    <p className="text-slate-500 font-normal mt-0.5">
                      Your payment was verified. You are authorized to read this content online and download the model file locally.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl font-mono text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap select-text">
                  {readerResource.content}
                </div>
              </div>

              {/* Drawer Footer actions */}
              <div className="p-6 md:p-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 rounded-b-none md:rounded-b-3xl">
                <div className="text-center sm:text-left">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Format Type</span>
                  <span className="block text-xs font-bold text-slate-700">Fully Formatted Text Document (.txt)</span>
                </div>
                <button
                  onClick={() => handleDownloadFile(readerResource)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/15 transition-all duration-200 cursor-pointer"
                >
                  <Download size={14} />
                  Download Model File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stripe Modal Integration */}
      <StripeModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        resource={selectedResource}
        onSuccess={handlePaymentSuccess}
      />

      {/* Auth Modal Integration */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab="signup"
      />
    </div>
  );
};
