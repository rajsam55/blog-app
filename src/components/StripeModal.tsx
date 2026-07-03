/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, Lock, Calendar, ShieldCheck, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PremiumResource } from '../types';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: PremiumResource | null;
  onSuccess: () => void;
}

export const StripeModal: React.FC<StripeModalProps> = ({ isOpen, onClose, resource, onSuccess }) => {
  const { processPayment } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [postal, setPostal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!resource) return null;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  // Format CVC (3 digits)
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (!cardNumber || !expiry || !cvc || !cardName) {
        throw new Error('Please fill in all credit card details.');
      }
      
      const strippedCard = cardNumber.replace(/\s+/g, '');
      if (strippedCard.length !== 16) {
        throw new Error('Card number must be exactly 16 digits.');
      }

      if (expiry.length !== 5) {
        throw new Error('Please specify expiration in MM/YY format.');
      }

      if (cvc.length !== 3) {
        throw new Error('CVC must be a 3-digit security code.');
      }

      await processPayment(resource.id, resource.price, cardNumber);
      setIsSuccess(true);
      
      // Keep success state open for a brief delay then close
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset states
        setCardNumber('');
        setExpiry('');
        setCvc('');
        setCardName('');
        setPostal('');
        setIsSuccess(false);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Payment declined. Use any 16-digit card.');
    } finally {
      setIsProcessing(false);
    }
  };

  const fillMockCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('123');
    setCardName('Jane Doe');
    setPostal('10001');
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Checkout Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-4xl overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-2xl z-10 flex flex-col md:flex-row"
          >
            {/* Left Column: Product Summary */}
            <div className="w-full md:w-5/12 bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <button
                  onClick={onClose}
                  className="md:hidden absolute top-6 right-6 p-1.5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
                >
                  <X size={16} />
                </button>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg">
                    <Sparkles size={16} />
                  </div>
                  <span className="font-display font-bold tracking-tight text-xs uppercase text-slate-300">SECURE CHECKOUT</span>
                </div>

                <div className="space-y-4">
                  <span className="inline-block px-2.5 py-1 bg-brand-600/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {resource.type} • {resource.level}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 md:mt-12 pt-6 border-t border-white/10">
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Document access</span>
                    <span>${resource.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-white/5 text-sm font-bold text-white">
                    <span>Total due</span>
                    <span className="text-brand-400 font-display">${resource.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2.5 text-[11px] text-slate-400">
                  <Lock size={12} className="text-brand-400 shrink-0" />
                  <span>Payments encrypted by 256-bit AES protection.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Credit Card Elements */}
            <div className="w-full md:w-7/12 p-8 md:p-10 relative">
              <button
                onClick={onClose}
                className="hidden md:block absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-all duration-200"
              >
                <X size={16} />
              </button>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                      <CheckCircle2 size={40} className="animate-bounce" />
                    </div>
                    <h4 className="text-xl font-bold tracking-tight text-slate-900">Payment Completed!</h4>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm">
                      Thank you for your purchase. We are securely unlocking your document for download now...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-base font-bold tracking-tight text-slate-900">Payment Information</h4>
                      <button
                        type="button"
                        onClick={fillMockCard}
                        className="text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 py-1 px-2.5 rounded-lg transition-all cursor-pointer"
                      >
                        Auto-fill Test Card
                      </button>
                    </div>

                    {error && (
                      <div className="flex gap-2.5 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-2xl mb-5 text-xs leading-relaxed animate-shake">
                        <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handlePay} className="space-y-4">
                      <div>
                        <label className="premium-label">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="premium-input"
                        />
                      </div>

                      <div>
                        <label className="premium-label">Card Number</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <CreditCard size={16} />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="premium-input pl-10 font-mono tracking-wider"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="premium-label">Expiration (MM/YY)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                              <Calendar size={16} />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="12/28"
                              value={expiry}
                              onChange={handleExpiryChange}
                              className="premium-input pl-10 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="premium-label">CVC (CVV)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                              <Lock size={16} />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="123"
                              value={cvc}
                              onChange={handleCvcChange}
                              className="premium-input pl-10 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="premium-label">Billing Zip/Postal Code</label>
                        <input
                          type="text"
                          required
                          placeholder="10001"
                          value={postal}
                          onChange={(e) => setPostal(e.target.value)}
                          className="premium-input"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShieldCheck size={16} />
                              Pay ${resource.price.toFixed(2)} Securely
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
