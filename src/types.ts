/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Grammar' | 'Vocabulary' | 'Academic Writing' | 'Idioms' | 'Speaking';
  excerpt: string;
  content: string; // Markdown supported
  author: string;
  readTime: string;
  imageUrl: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface PremiumResource {
  id: string;
  title: string;
  type: 'Essay' | 'Report' | 'Guide';
  description: string;
  price: number;
  content: string; // The downloadable resource content
  wordCount: number;
  level: 'Intermediate' | 'Advanced' | 'IELTS 8.0+' | 'All Levels';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userEmail: string;
  userId: string;
  resourceId: string;
  resourceTitle: string;
  amount: number;
  createdAt: string;
}
