/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost, PremiumResource, Transaction } from '../types';
import { 
  Users, BookOpen, Layers, DollarSign, Plus, Edit, Trash2, 
  Search, Eye, FileText, ChevronRight, LayoutGrid, ClipboardList,
  TrendingUp, ShieldAlert, CheckCircle2, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, users, blogPosts, resources, transactions,
    addBlogPost, updateBlogPost, deleteBlogPost,
    addResource, updateResource, deleteResource 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'resources' | 'sales'>('overview');
  
  // Blog Post states
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<'Grammar' | 'Vocabulary' | 'Academic Writing' | 'Idioms' | 'Speaking'>('Grammar');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postReadTime, setPostReadTime] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');

  // Resource states
  const [isResFormOpen, setIsResFormOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<PremiumResource | null>(null);
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'Essay' | 'Report' | 'Guide'>('Essay');
  const [resDescription, setResDescription] = useState('');
  const [resPrice, setResPrice] = useState(4.99);
  const [resContent, setResContent] = useState('');
  const [resWordCount, setResWordCount] = useState(300);
  const [resLevel, setResLevel] = useState<'Intermediate' | 'Advanced' | 'IELTS 8.0+' | 'All Levels'>('All Levels');

  const [notification, setNotification] = useState<string | null>(null);

  // Authorization Guard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-3xl inline-block mb-4">
          <ShieldAlert size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Administrative Access Denied</h2>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
          You do not possess the clearance levels necessary to manage the LingoCraft ledger or curricula. Please sign in with an Administrator profile.
        </p>
      </div>
    );
  }

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Total Sales Calculation
  const totalRevenue = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  // Blog Post Handler
  const openBlogCreate = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostCategory('Grammar');
    setPostExcerpt('');
    setPostContent('');
    setPostAuthor(currentUser.name);
    setPostReadTime('5 min read');
    setPostImageUrl('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800');
    setIsBlogFormOpen(true);
  };

  const openBlogEdit = (post: BlogPost) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostCategory(post.category);
    setPostExcerpt(post.excerpt);
    setPostContent(post.content);
    setPostAuthor(post.author);
    setPostReadTime(post.readTime);
    setPostImageUrl(post.imageUrl);
    setIsBlogFormOpen(true);
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postExcerpt || !postContent) return;

    if (editingPost) {
      updateBlogPost({
        ...editingPost,
        title: postTitle,
        category: postCategory,
        excerpt: postExcerpt,
        content: postContent,
        author: postAuthor,
        readTime: postReadTime,
        imageUrl: postImageUrl,
      });
      triggerNotification('Blog post updated successfully.');
    } else {
      addBlogPost({
        title: postTitle,
        category: postCategory,
        excerpt: postExcerpt,
        content: postContent,
        author: postAuthor,
        readTime: postReadTime,
        imageUrl: postImageUrl,
      });
      triggerNotification('Blog post created and published.');
    }
    setIsBlogFormOpen(false);
  };

  const handleBlogDelete = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this blog post? This action is irreversible.')) {
      deleteBlogPost(id);
      triggerNotification('Blog post removed.');
    }
  };

  // Resource Handler
  const openResCreate = () => {
    setEditingRes(null);
    setResTitle('');
    setResType('Essay');
    setResDescription('');
    setResPrice(4.99);
    setResContent('');
    setResWordCount(350);
    setResLevel('All Levels');
    setIsResFormOpen(true);
  };

  const openResEdit = (res: PremiumResource) => {
    setEditingRes(res);
    setResTitle(res.title);
    setResType(res.type);
    setResDescription(res.description);
    setResPrice(res.price);
    setResContent(res.content);
    setResWordCount(res.wordCount);
    setResLevel(res.level);
    setIsResFormOpen(true);
  };

  const handleResSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle || !resDescription || !resContent) return;

    if (editingRes) {
      updateResource({
        ...editingRes,
        title: resTitle,
        type: resType,
        description: resDescription,
        price: Number(resPrice),
        content: resContent,
        wordCount: Number(resWordCount),
        level: resLevel,
      });
      triggerNotification('Premium resource revised successfully.');
    } else {
      addResource({
        title: resTitle,
        type: resType,
        description: resDescription,
        price: Number(resPrice),
        content: resContent,
        wordCount: Number(resWordCount),
        level: resLevel,
      });
      triggerNotification('New premium resource compiled and listed.');
    }
    setIsResFormOpen(false);
  };

  const handleResDelete = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this resource? Any user who purchased it will lose access.')) {
      deleteResource(id);
      triggerNotification('Resource removed from catalogue.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      
      {/* Alert Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 flex items-center gap-2 px-5 py-3.5 bg-slate-900 border border-slate-800 text-brand-400 rounded-2xl shadow-xl text-xs font-semibold"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-8 md:p-10 rounded-[32px] shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest font-mono">
            ADMIN PANEL CONTROLS
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
            Professor's Ledger & Curriculum
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
            Manage your English language lessons, compile model documents, and inspect transaction ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'posts' && !isBlogFormOpen && (
            <button
              onClick={openBlogCreate}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-brand-600/10 cursor-pointer transition-all"
            >
              <Plus size={14} />
              Create Tutorial
            </button>
          )}
          {activeTab === 'resources' && !isResFormOpen && (
            <button
              onClick={openResCreate}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer transition-all"
            >
              <Plus size={14} />
              Compile Resource
            </button>
          )}
        </div>
      </div>

      {/* Primary Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Curated Lessons', val: blogPosts.length, icon: BookOpen, col: 'text-blue-500 bg-blue-50/50' },
          { label: 'Premium Models', val: resources.length, icon: Layers, col: 'text-indigo-500 bg-indigo-50/50' },
          { label: 'Student Accounts', val: users.length, icon: Users, col: 'text-amber-500 bg-amber-50/50' },
          { label: 'Aggregate Ledger', val: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, col: 'text-emerald-500 bg-emerald-50/50' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 p-5 md:p-6 rounded-3xl shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${item.col} shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                <span className="block text-lg md:text-xl font-display font-extrabold text-slate-900 mt-0.5">{item.val}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview' as const, label: 'Analytics & Ledger', icon: TrendingUp },
          { id: 'posts' as const, label: 'Manage Blog', icon: BookOpen },
          { id: 'resources' as const, label: 'Curate Resources', icon: Layers },
          { id: 'sales' as const, label: 'Sales Records', icon: ClipboardList },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setIsBlogFormOpen(false);
                setIsResFormOpen(false);
              }}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Primary Panels Switcher */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW & GENERAL ANALYTICS */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column A: Recent Transactions */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                    Ledger Log (Recent Transactions)
                  </h3>
                  {transactions.length > 0 ? (
                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Buyer Email</th>
                            <th className="p-3">Acquired Resource</th>
                            <th className="p-3">Price</th>
                            <th className="p-3 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {transactions.slice(0, 5).map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-700">{tx.userEmail}</td>
                              <td className="p-3 font-medium text-slate-600 truncate max-w-[200px]">{tx.resourceTitle}</td>
                              <td className="p-3 font-bold text-emerald-600">${tx.amount.toFixed(2)}</td>
                              <td className="p-3 text-right text-slate-400 font-medium font-mono">{tx.createdAt.split(' ')[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-medium">
                      No sales recorded in database yet. Purchases will appear here immediately upon successful checkout processing.
                    </div>
                  )}
                </div>

                {/* Column B: Recent Registrations */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                    Registered Students
                  </h3>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex justify-between items-center text-xs">
                        <div>
                          <span className="block font-bold text-slate-800">{u.name}</span>
                          <span className="block text-[10px] text-slate-400 font-medium">{u.email}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-indigo-50 border border-indigo-100 text-indigo-700'
                            : 'bg-brand-50 border border-brand-100 text-brand-700'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MANAGE BLOG POSTS */}
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {isBlogFormOpen ? (
                /* CREATE / EDIT BLOG FORM */
                <form onSubmit={handleBlogSubmit} className="space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                      {editingPost ? 'Edit Blog Tutorial' : 'Compose New Tutorial'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsBlogFormOpen(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="premium-label">Tutorial Title</label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="e.g. Master Subject-Verb Agreement in 5 Simple Steps"
                        className="premium-input"
                      />
                    </div>

                    <div>
                      <label className="premium-label">Topic Category</label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value as any)}
                        className="premium-input"
                      >
                        <option value="Grammar">Grammar</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="Academic Writing">Academic Writing</option>
                        <option value="Idioms">Idioms</option>
                        <option value="Speaking">Speaking</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="premium-label">Short Excerpt (Teaser text for home index)</label>
                    <textarea
                      required
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="e.g. Many learners struggle with identifying inverted subject constructs..."
                      rows={2}
                      className="premium-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="premium-label">Author Name & Tagline</label>
                      <input
                        type="text"
                        required
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        className="premium-input"
                      />
                    </div>
                    <div>
                      <label className="premium-label">Estimated Reading Time</label>
                      <input
                        type="text"
                        required
                        value={postReadTime}
                        onChange={(e) => setPostReadTime(e.target.value)}
                        placeholder="e.g. 5 min read"
                        className="premium-input"
                      />
                    </div>
                    <div>
                      <label className="premium-label">Featured Image URL</label>
                      <input
                        type="text"
                        value={postImageUrl}
                        onChange={(e) => setPostImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="premium-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="premium-label">Tutorial Content (Standard text spacing. Supports double line break paragraphs and custom titles)</label>
                    <textarea
                      required
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="# Demystifying inverted verbs... \n\nThis structures when tenses..."
                      rows={12}
                      className="premium-input font-mono text-xs"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBlogFormOpen(false)}
                      className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-600/10 cursor-pointer"
                    >
                      {editingPost ? 'Save Changes' : 'Publish Tutorial'}
                    </button>
                  </div>
                </form>
              ) : (
                /* TUTORIAL LIST TABLE */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                      Tutorial Catalog
                    </h3>
                  </div>

                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Author</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {blogPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-800 truncate max-w-[250px]">{post.title}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">
                                {post.category}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-600">{post.author.split(',')[0]}</td>
                            <td className="p-3 font-medium text-slate-400 font-mono">{post.createdAt}</td>
                            <td className="p-3 text-right flex justify-end gap-1.5">
                              <button
                                onClick={() => openBlogEdit(post)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleBlogDelete(post.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: CURATE PREMIUM RESOURCES */}
          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {isResFormOpen ? (
                /* CREATE / EDIT RESOURCE FORM */
                <form onSubmit={handleResSubmit} className="space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                      {editingRes ? 'Edit Licensed Asset' : 'Compile Premium Asset'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsResFormOpen(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className="premium-label">Asset Title</label>
                      <input
                        type="text"
                        required
                        value={resTitle}
                        onChange={(e) => setResTitle(e.target.value)}
                        placeholder="e.g. Model Band 9.0 Essay: Corporate Social Responsibility"
                        className="premium-input"
                      />
                    </div>

                    <div>
                      <label className="premium-label">Format Type</label>
                      <select
                        value={resType}
                        onChange={(e) => setResType(e.target.value as any)}
                        className="premium-input"
                      >
                        <option value="Essay">Essay</option>
                        <option value="Report">Report</option>
                        <option value="Guide">Guide</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="premium-label">Detailed Description (Explains why students should buy this)</label>
                    <textarea
                      required
                      value={resDescription}
                      onChange={(e) => setResDescription(e.target.value)}
                      placeholder="e.g. Includes full examiner annotations on transition vocabulary and lexical precision."
                      rows={2}
                      className="premium-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="premium-label">Price Tag ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={resPrice}
                        onChange={(e) => setResPrice(Number(e.target.value))}
                        className="premium-input"
                      />
                    </div>

                    <div>
                      <label className="premium-label">Word Count</label>
                      <input
                        type="number"
                        required
                        value={resWordCount}
                        onChange={(e) => setResWordCount(Number(e.target.value))}
                        className="premium-input"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="premium-label">Target Difficulty Level</label>
                      <select
                        value={resLevel}
                        onChange={(e) => setResLevel(e.target.value as any)}
                        className="premium-input"
                      >
                        <option value="All Levels">All Levels</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="IELTS 8.0+">IELTS 8.0+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="premium-label">Licensed Academic Document Content (Formatted for download)</label>
                    <textarea
                      required
                      value={resContent}
                      onChange={(e) => setResContent(e.target.value)}
                      placeholder="[IELTS Task 2 Model Answer]..."
                      rows={12}
                      className="premium-input font-mono text-xs"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsResFormOpen(false)}
                      className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                    >
                      {editingRes ? 'Save Asset Changes' : 'Compile & List Asset'}
                    </button>
                  </div>
                </form>
              ) : (
                /* PREMIUM RESOURCE LIST TABLE */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                      Asset Catalog
                    </h3>
                  </div>

                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Title</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Level</th>
                          <th className="p-3">Price</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {resources.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-800 truncate max-w-[250px]">{res.title}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[9px] font-bold text-emerald-600 uppercase">
                                {res.type}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-500">{res.level}</td>
                            <td className="p-3 font-extrabold text-slate-900">${res.price.toFixed(2)}</td>
                            <td className="p-3 text-right flex justify-end gap-1.5">
                              <button
                                onClick={() => openResEdit(res)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleResDelete(res.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: ENTIRE SALES RECORDS */}
          {activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-mono">
                Comprehensive Ledger Records
              </h3>

              {transactions.length > 0 ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Invoice ID</th>
                        <th className="p-3">Buyer Email</th>
                        <th className="p-3">Acquired Asset</th>
                        <th className="p-3">Price Paid</th>
                        <th className="p-3 text-right">Invoice Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono text-slate-400">{tx.id}</td>
                          <td className="p-3 font-semibold text-slate-700">{tx.userEmail}</td>
                          <td className="p-3 font-medium text-slate-600 truncate max-w-[200px]">{tx.resourceTitle}</td>
                          <td className="p-3 font-bold text-emerald-600">${tx.amount.toFixed(2)}</td>
                          <td className="p-3 text-right text-slate-400 font-mono font-medium">{tx.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-medium bg-slate-50">
                  The ledger is currently clear. No simulated transactions have been processed in this session.
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
