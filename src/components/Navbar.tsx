/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { BookOpen, LogOut, User as UserIcon, Menu, X, LayoutDashboard, Compass, Layers, Sparkles, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: 'home' | 'blog' | 'resources' | 'admin';
  setView: (view: 'home' | 'blog' | 'resources' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { currentUser, signOut } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleAuthTrigger = (tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Explore', view: 'home' as const, icon: Compass },
    { label: 'English Blog', view: 'blog' as const, icon: BookOpen },
    { label: 'Premium Models', view: 'resources' as const, icon: Layers },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-2.5 focus:outline-none group cursor-pointer"
              >
                <div className="p-2 bg-gradient-to-br from-brand-500 to-indigo-600 text-white rounded-xl shadow-md shadow-brand-500/10 group-hover:scale-105 transition-all duration-300">
                  <GraduationCap size={20} />
                </div>
                <div className="text-left">
                  <span className="font-display font-bold tracking-tight text-base text-slate-900 block leading-tight">
                    LingoCraft
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block -mt-0.5">
                    Academia
                  </span>
                </div>
              </button>

              {/* Desktop Nav Items */}
              <div className="hidden md:flex items-center ml-10 space-x-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => setView(item.view)}
                      className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Action Bar */}
            <div className="hidden md:flex items-center gap-4">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50/50'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  Admin Dashboard
                </button>
              )}

              {currentUser ? (
                /* Profile Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 bg-slate-50 border border-slate-100 hover:bg-slate-100/70 rounded-full transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold rounded-full flex items-center justify-center text-xs">
                      {currentUser.name[0].toUpperCase()}
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-800 -mb-0.5 leading-none max-w-[100px] truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-20"
                        >
                          <div className="px-4 py-2 border-b border-slate-100 mb-1">
                            <span className="block text-xs font-medium text-slate-400">Signed in as</span>
                            <span className="block text-xs font-bold text-slate-700 truncate">{currentUser.email}</span>
                          </div>

                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                setView('admin');
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-all text-left cursor-pointer"
                            >
                              <LayoutDashboard size={14} />
                              Admin Dashboard
                            </button>
                          )}

                          <button
                            onClick={() => {
                              signOut();
                              setView('home');
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
                          >
                            <LogOut size={14} />
                            Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAuthTrigger('signin')}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-all cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleAuthTrigger('signup')}
                    className="flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 active:shadow-none transition-all duration-200 cursor-pointer"
                  >
                    <Sparkles size={13} />
                    Premium Access
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        setView(item.view);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setView('admin');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                      currentView === 'admin'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-indigo-600 hover:bg-indigo-50/50'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </button>
                )}

                <div className="pt-4 border-t border-slate-100">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2">
                        <span className="block text-xs font-semibold text-slate-400">Signed in as</span>
                        <span className="block text-sm font-bold text-slate-800">{currentUser.name}</span>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentUser.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setView('home');
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
                      >
                        <LogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 p-2">
                      <button
                        onClick={() => handleAuthTrigger('signin')}
                        className="w-full text-center py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => handleAuthTrigger('signup')}
                        className="w-full text-center py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all shadow-md shadow-brand-600/10"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />
    </>
  );
};
