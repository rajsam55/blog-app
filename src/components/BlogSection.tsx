/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { Search, Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Bookmark, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogSectionProps {
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ selectedPostId, setSelectedPostId }) => {
  const { blogPosts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top on reading a post
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedPostId]);

  const categories = ['All', 'Grammar', 'Vocabulary', 'Academic Writing', 'Idioms', 'Speaking'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedPost = blogPosts.find(p => p.id === selectedPostId);

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Highly robust custom markdown parser for rendering teaching content with top-tier precision
  const renderMarkdownContent = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    const elements: React.JSX.Element[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc list-inside space-y-2 mb-4 pl-2 text-slate-700 leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushTable = (key: number) => {
      if (tableRows.length > 0) {
        // Simple heuristic: the first row might be headers
        const headers = tableRows[0];
        const bodyRows = tableRows.slice(2); // row[1] is typically separator like |:---|
        elements.push(
          <div key={`table-wrapper-${key}`} className="overflow-x-auto my-6 border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full border-collapse text-xs md:text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  {headers.map((h, idx) => (
                    <th key={idx} className="p-3 md:p-4 border-b border-slate-200" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(h.trim()) }} />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 md:p-4 text-slate-600 font-medium" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell.trim()) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    const parseInlineMarkdown = (str: string) => {
      return str
        // Bold tags
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
        // Italic tags
        .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
        // Inline code / Highlight tags
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-brand-700 font-medium">$1</code>');
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check table row (starts and ends with |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList(index);
        inTable = true;
        const cells = trimmed.split('|').slice(1, -1);
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(index);
      }

      // Check Heading 1
      if (trimmed.startsWith('# ')) {
        flushList(index);
        elements.push(
          <h1 key={index} className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-8">
            {trimmed.substring(2)}
          </h1>
        );
      }
      // Check Heading 2
      else if (trimmed.startsWith('## ')) {
        flushList(index);
        elements.push(
          <h2 key={index} className="font-display text-lg md:text-xl font-bold text-slate-800 mt-8 mb-4">
            {trimmed.substring(3)}
          </h2>
        );
      }
      // Check Heading 3
      else if (trimmed.startsWith('### ')) {
        flushList(index);
        elements.push(
          <h3 key={index} className="font-display text-base md:text-lg font-semibold text-slate-800 mt-6 mb-2">
            {trimmed.substring(4)}
          </h3>
        );
      }
      // Check Blockquote
      else if (trimmed.startsWith('> ')) {
        flushList(index);
        elements.push(
          <blockquote key={index} className="pl-4 border-l-4 border-brand-500 bg-brand-50/50 py-3 pr-3 rounded-r-2xl my-4 text-xs md:text-sm text-slate-800 italic font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed.substring(2)) }} />
        );
      }
      // Check Bullet Points
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(trimmed.substring(2));
      }
      // Check separators
      else if (trimmed === '---') {
        flushList(index);
        elements.push(<hr key={index} className="border-t border-slate-100 my-6" />);
      }
      // Empty line
      else if (trimmed === '') {
        flushList(index);
      }
      // Normal Paragraph
      else {
        flushList(index);
        elements.push(
          <p key={index} className="mb-4 leading-relaxed text-slate-600 text-sm md:text-base font-medium" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }} />
        );
      }
    });

    // Final flush
    flushList(lines.length);
    flushTable(lines.length);

    return <div className="markdown-body mt-6">{elements}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimatePresence mode="wait">
        {!selectedPostId ? (
          /* View A: Blog Archive Index */
          <motion.div
            key="archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Header section */}
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-mono">
                LingoCraft Blog
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2">
                Grammar, Composition, and Lexicon Guides
              </h1>
              <p className="text-slate-500 text-sm mt-3 font-medium">
                Browse through academic tutorials compiled by veteran IELTS/TOEFL evaluators and professional linguists.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm">
              {/* Category tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none custom-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
                        : 'bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 text-xs font-semibold placeholder:text-slate-400 text-slate-700 transition-all"
                />
              </div>
            </div>

            {/* Grid of Posts */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Card image header */}
                    <div className="h-48 relative overflow-hidden shrink-0">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <span className="absolute top-4 left-4 px-2.5 py-1 bg-brand-600 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-2.5">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {post.createdAt}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 
                          onClick={() => setSelectedPostId(post.id)}
                          className="text-base font-bold tracking-tight text-slate-950 line-clamp-2 hover:text-brand-600 transition-colors duration-200 leading-snug cursor-pointer"
                        >
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer author block */}
                      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">
                          By {post.author.split(',')[0]}
                        </span>
                        <button
                          onClick={() => setSelectedPostId(post.id)}
                          className="flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700 transition-colors cursor-pointer"
                        >
                          Read Lesson
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <span className="text-2xl">🔍</span>
                <h3 className="text-base font-bold text-slate-800 mt-2">No tutorials found</h3>
                <p className="text-slate-400 text-xs mt-1">Try refining your keyword search or filter variables.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* View B: Detailed Reading Page */
          selectedPost && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Back Nav Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedPostId(null)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back to lessons
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 border rounded-xl transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-brand-50 border-brand-200 text-brand-600'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                    {copiedLink ? 'Copied' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Main Reading Canvas */}
              <article className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden p-6 md:p-12 shadow-sm space-y-6">
                
                {/* Header metadata */}
                <div className="space-y-4 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-950 leading-tight">
                    {selectedPost.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      {selectedPost.author}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {selectedPost.createdAt}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {selectedPost.readTime}
                    </span>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="h-64 md:h-[400px] w-full rounded-2xl md:rounded-3xl overflow-hidden relative shadow-inner">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Body Content */}
                <div className="pt-4 border-t border-slate-50">
                  {renderMarkdownContent(selectedPost.content)}
                </div>

              </article>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};
