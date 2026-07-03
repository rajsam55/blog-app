/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, BookOpen, Layers, Sparkles, GraduationCap, CheckCircle2, ChevronRight, MessageSquare, Award, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  setView: (view: 'home' | 'blog' | 'resources' | 'admin') => void;
  setSelectedPostId: (id: string | null) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView, setSelectedPostId }) => {
  const { blogPosts, resources } = useApp();

  // Get featured and top posts
  const featuredPost = blogPosts.find(p => p.isFeatured) || blogPosts[0];
  const secondaryPosts = blogPosts.filter(p => p.id !== featuredPost?.id).slice(0, 2);

  const stats = [
    { value: '98%', label: 'IELTS Band 7.5+ Rate', icon: Award, color: 'text-emerald-500 bg-emerald-50' },
    { value: '45,000+', label: 'Monthly Readers', icon: Flame, color: 'text-orange-500 bg-orange-50' },
    { value: '150+', label: 'Premium Models', icon: Layers, color: 'text-brand-500 bg-brand-50' },
  ];

  const pillars = [
    {
      title: 'Grammar Precision',
      desc: 'Master the complex structures, tenses, and sentence structures examiners actively look for.',
      category: 'Grammar',
      color: 'from-blue-500 to-brand-600',
    },
    {
      title: 'Academic Vocabulary',
      desc: 'Upgrade from basic descriptions to precise, high-register synonyms that drive academic excellence.',
      category: 'Vocabulary',
      color: 'from-brand-500 to-indigo-600',
    },
    {
      title: 'Persuasive Essays',
      desc: 'Learn how to structure arguments, write strong thesis statements, and handle concessions.',
      category: 'Academic Writing',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setView('blog');
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase flex items-center gap-1">
              <Sparkles size={12} className="text-brand-500" /> Executive English Academy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
          >
            Master the Art of <span className="gradient-text">Academic & Professional</span> English
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Explore expert-written tutorials on grammar precision and professional communication. Purchase premium examiner-graded essays and strategic corporate templates to supercharge your career.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={() => setView('blog')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20 active:shadow-none transition-all duration-200 cursor-pointer"
            >
              <BookOpen size={16} />
              Read Blog Lessons
            </button>
            <button
              onClick={() => setView('resources')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-2xl shadow-sm hover:border-slate-300 transition-all duration-200 cursor-pointer"
            >
              <Layers size={16} />
              Browse Premium Models
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-4 md:justify-center">
                <div className={`p-3 rounded-2xl ${stat.color} shrink-0`}>
                  <Icon size={24} />
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-display font-bold text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Learning Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Pedagogical Core
          </span>
          <h2 className="text-3xl font-bold tracking-tight mt-2 text-slate-900">
            Our Primary Focus Areas
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
            Our content is precisely designed to build syntactic flexibility, vocabulary depth, and structural strength.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="group relative bg-white border border-slate-200/80 p-8 rounded-3xl hover:shadow-md transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-3xl bg-gradient-to-r ${pillar.color}`} />
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                {pillar.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-3">
                {pillar.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                {pillar.desc}
              </p>
              <button
                onClick={() => setView('blog')}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:text-brand-700 transition-all cursor-pointer"
              >
                Explore Lessons
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Blog Posts Section */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Fresh Lessons
              </span>
              <h2 className="text-3xl font-bold tracking-tight mt-1 text-slate-900">
                Latest from LingoCraft
              </h2>
            </div>
            <button
              onClick={() => setView('blog')}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-all cursor-pointer"
            >
              View All Blog Posts
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Featured Post Hero Card (Left 2 columns) */}
            <div className="lg:col-span-2 flex flex-col md:flex-row bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="w-full md:w-1/2 h-56 md:h-auto relative overflow-hidden shrink-0">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {featuredPost.category}
                </span>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Featured Tutorial • {featuredPost.readTime}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-2 hover:text-brand-600 transition-colors cursor-pointer" onClick={() => handlePostClick(featuredPost.id)}>
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mt-3">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex justify-between items-center pt-5 border-t border-slate-50">
                  <span className="text-xs font-semibold text-slate-500">{featuredPost.author}</span>
                  <button
                    onClick={() => handlePostClick(featuredPost.id)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    Read Lesson
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Side Cards */}
            <div className="space-y-6 flex flex-col justify-between">
              {secondaryPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-md transition-all duration-300 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3">
                      {post.category}
                    </span>
                    <h4 className="text-sm font-bold tracking-tight text-slate-900 leading-snug hover:text-brand-600 transition-colors cursor-pointer" onClick={() => handlePostClick(post.id)}>
                      {post.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-slate-400">{post.readTime}</span>
                    <button
                      onClick={() => handlePostClick(post.id)}
                      className="font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                    >
                      Read Lesson →
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 5. Premium Models Showcase Teaser */}
      <section className="relative overflow-hidden bg-slate-900 py-20 rounded-[40px] max-w-7xl mx-auto px-6 sm:px-12">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
              <Sparkles size={12} /> Academia Premium Models
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Unlock Model Writing Graded by Elite Evaluators
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-lg font-medium">
              Studying theory is only half the battle. To guarantee an outstanding score in university panels, IELTS academic modules, or corporate portfolios, you need to study exact model copies. We provide downloadable essays, statistical reports, and executive correspondences.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                'Strict compliance with band 9.0 parameters',
                'Exhaustive examiner vocabulary & structural annotations',
                'Fully annotated transition blocks and grammatical markers',
                'One-click instant digital secure downloads (PDF/DOC)',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                  <CheckCircle2 size={16} className="text-brand-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button
                onClick={() => setView('resources')}
                className="flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-600/20 transition-all cursor-pointer"
              >
                Explore Premium Files
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest font-mono">
              PREVIEW CATOLOGUE
            </span>
            <div className="space-y-4">
              {resources.slice(0, 2).map((res) => (
                <div
                  key={res.id}
                  onClick={() => setView('resources')}
                  className="flex justify-between items-center p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-left">
                    <span className="inline-block px-2 py-0.5 bg-white/10 text-white text-[9px] font-bold rounded-md uppercase tracking-wider mb-1.5">
                      {res.type}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
                      {res.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-1">{res.wordCount} words • {res.level}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white block">${res.price}</span>
                    <span className="text-[9px] text-brand-400 font-bold block mt-0.5">UNLOCK →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Professional Testimonial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono block mb-3">
            Academic Reviews
          </span>
          <MessageSquare className="text-brand-500/20 mx-auto mb-4" size={40} />
          <blockquote className="text-lg font-display font-medium text-slate-800 leading-relaxed italic">
            "LingoCraft is the gold standard for English learners who already have a basic understanding but need to master high-level academic complexity. Their annotated essay templates saved me weeks of preparation and allowed me to score an 8.5 in the IELTS writing section."
          </blockquote>
          <div className="mt-6">
            <span className="block text-sm font-bold text-slate-900">Eduardo Da Silva</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Graduate Student, Cambridge University
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
