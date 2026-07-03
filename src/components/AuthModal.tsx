/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'signin' }) => {
  const { signIn, signUp } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('student');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tab === 'signin') {
        if (!email || !password) {
          throw new Error('Please fill in all fields.');
        }
        await signIn(email, password);
      } else {
        if (!name || !email) {
          throw new Error('Please fill in all fields.');
        }
        await signUp(name, email, role);
      }
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (type: 'student' | 'admin') => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (type === 'student') {
        await signIn('student@englishblog.com', 'student123');
      } else {
        await signIn('admin@englishblog.com', 'admin123');
      }
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-2xl z-10"
          >
            {/* Header / Brand */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                <X size={16} />
              </button>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                  <GraduationCap size={20} />
                </div>
                <span className="font-display font-bold tracking-tight text-sm uppercase">LingoCraft</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mt-1">
                {tab === 'signin' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                {tab === 'signin' 
                  ? 'Access expert tutorials and premium downloadable models' 
                  : 'Join thousands of students mastering formal academic English'}
              </p>
            </div>

            {/* Content Body */}
            <div className="p-8">
              {error && (
                <div className="flex gap-2.5 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-2xl mb-6 text-xs leading-relaxed animate-shake">
                  <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="premium-label">Your Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="premium-input pl-10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="premium-label">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="premium-input pl-10"
                    />
                  </div>
                </div>

                {tab === 'signin' && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="premium-label mb-0">Password</label>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="premium-input pl-10"
                      />
                    </div>
                  </div>
                )}

                {tab === 'signup' && (
                  <div>
                    <label className="premium-label">Register As</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                          role === 'student'
                            ? 'bg-brand-50 border-brand-200 text-brand-700 ring-2 ring-brand-500/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <GraduationCap size={16} />
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                          role === 'admin'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <UserIcon size={16} />
                        Admin
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20 active:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts Panel */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="text-center mb-3">
                  <span className="px-3 bg-white text-slate-400 font-semibold tracking-wider text-[10px] uppercase">
                    Rapid Demo Bypass
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student')}
                    className="flex flex-col items-center justify-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-brand-50/50 hover:border-brand-200 text-slate-600 hover:text-brand-700 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-xs font-bold">Demo Student</span>
                    <span className="text-[10px] text-slate-400">student123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="flex flex-col items-center justify-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-indigo-50/50 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-xs font-bold">Demo Admin</span>
                    <span className="text-[10px] text-slate-400">admin123</span>
                  </button>
                </div>
              </div>

              {/* Toggle Tab */}
              <div className="mt-6 text-center text-xs text-slate-500 font-medium">
                {tab === 'signin' ? (
                  <>
                    New to LingoCraft?{' '}
                    <button
                      onClick={() => setTab('signup')}
                      className="text-brand-600 hover:text-brand-700 font-bold transition-all duration-200 cursor-pointer"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setTab('signin')}
                      className="text-brand-600 hover:text-brand-700 font-bold transition-all duration-200 cursor-pointer"
                    >
                      Sign in instead
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
