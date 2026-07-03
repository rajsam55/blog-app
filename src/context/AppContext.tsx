/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BlogPost, PremiumResource, Transaction, UserRole } from '../types';
import { INITIAL_BLOG_POSTS, INITIAL_RESOURCES } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  blogPosts: BlogPost[];
  resources: PremiumResource[];
  transactions: Transaction[];
  unlockedResourceIds: string[];
  isLoading: boolean;
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, role: UserRole) => Promise<User>;
  signOut: () => void;
  
  // Blog actions (Admin)
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  
  // Resource actions (Admin)
  addResource: (resource: Omit<PremiumResource, 'id' | 'createdAt'>) => void;
  updateResource: (resource: PremiumResource) => void;
  deleteResource: (id: string) => void;
  
  // Payment Simulator
  processPayment: (resourceId: string, amount: number, cardNumber: string) => Promise<void>;
  isResourceUnlocked: (resourceId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<PremiumResource[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [unlockedResourceIds, setUnlockedResourceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load and initialize data
  useEffect(() => {
    // Users initialization
    const storedUsers = localStorage.getItem('el_users');
    let initializedUsers: User[] = [];
    if (storedUsers) {
      initializedUsers = JSON.parse(storedUsers);
    } else {
      initializedUsers = [
        {
          id: 'admin-1',
          name: 'Professor Arthur',
          email: 'admin@englishblog.com',
          role: 'admin',
          createdAt: '2026-06-01'
        },
        {
          id: 'user-1',
          name: 'Jane Doe',
          email: 'student@englishblog.com',
          role: 'student',
          createdAt: '2026-06-15'
        }
      ];
      localStorage.setItem('el_users', JSON.stringify(initializedUsers));
    }
    setUsers(initializedUsers);

    // Blog posts initialization
    const storedPosts = localStorage.getItem('el_blog_posts');
    if (storedPosts) {
      setBlogPosts(JSON.parse(storedPosts));
    } else {
      setBlogPosts(INITIAL_BLOG_POSTS);
      localStorage.setItem('el_blog_posts', JSON.stringify(INITIAL_BLOG_POSTS));
    }

    // Resources initialization
    const storedResources = localStorage.getItem('el_resources');
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    } else {
      setResources(INITIAL_RESOURCES);
      localStorage.setItem('el_resources', JSON.stringify(INITIAL_RESOURCES));
    }

    // Transactions initialization
    const storedTransactions = localStorage.getItem('el_transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions([]);
      localStorage.setItem('el_transactions', JSON.stringify([]));
    }

    // Current session initialization
    const storedSession = localStorage.getItem('el_current_user');
    if (storedSession) {
      const user: User = JSON.parse(storedSession);
      setCurrentUser(user);
      
      // Load user purchases
      const storedPurchases = localStorage.getItem(`el_unlocked_${user.id}`);
      if (storedPurchases) {
        setUnlockedResourceIds(JSON.parse(storedPurchases));
      } else {
        // Pre-unlock first resource for mock student to make exploration instant and delightful
        if (user.role === 'student') {
          const defaultUnlock = ['res-1'];
          setUnlockedResourceIds(defaultUnlock);
          localStorage.setItem(`el_unlocked_${user.id}`, JSON.stringify(defaultUnlock));
        } else {
          setUnlockedResourceIds([]);
        }
      }
    }

    setIsLoading(false);
  }, []);

  // Update purchases when user changes
  useEffect(() => {
    if (currentUser) {
      const storedPurchases = localStorage.getItem(`el_unlocked_${currentUser.id}`);
      if (storedPurchases) {
        setUnlockedResourceIds(JSON.parse(storedPurchases));
      } else {
        setUnlockedResourceIds([]);
      }
    } else {
      setUnlockedResourceIds([]);
    }
  }, [currentUser]);

  // Auth actions
  const signIn = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Admin credentials
        if (email.toLowerCase() === 'admin@englishblog.com' && password === 'admin123') {
          const adminUser = users.find(u => u.email === 'admin@englishblog.com');
          if (adminUser) {
            setCurrentUser(adminUser);
            localStorage.setItem('el_current_user', JSON.stringify(adminUser));
            resolve(adminUser);
            return;
          }
        }
        
        // Student credentials
        if (email.toLowerCase() === 'student@englishblog.com' && password === 'student123') {
          const studentUser = users.find(u => u.email === 'student@englishblog.com');
          if (studentUser) {
            setCurrentUser(studentUser);
            localStorage.setItem('el_current_user', JSON.stringify(studentUser));
            resolve(studentUser);
            return;
          }
        }

        // Search user in database
        const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (matchedUser) {
          // In a real app we'd verify password. For this demo, we let any registered user sign in with any password (except admin).
          setCurrentUser(matchedUser);
          localStorage.setItem('el_current_user', JSON.stringify(matchedUser));
          resolve(matchedUser);
        } else {
          reject(new Error('Invalid email or password. Use student@englishblog.com / student123 or admin@englishblog.com / admin123 to login instantly!'));
        }
      }, 800);
    });
  };

  const signUp = async (name: string, email: string, role: UserRole): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          reject(new Error('This email is already registered.'));
          return;
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          role,
          createdAt: new Date().toISOString().split('T')[0]
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('el_users', JSON.stringify(updatedUsers));

        setCurrentUser(newUser);
        localStorage.setItem('el_current_user', JSON.stringify(newUser));

        resolve(newUser);
      }, 800);
    });
  };

  const signOut = () => {
    setCurrentUser(null);
    setUnlockedResourceIds([]);
    localStorage.removeItem('el_current_user');
  };

  // Blog post actions
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedPosts = [newPost, ...blogPosts];
    setBlogPosts(updatedPosts);
    localStorage.setItem('el_blog_posts', JSON.stringify(updatedPosts));
  };

  const updateBlogPost = (post: BlogPost) => {
    const updatedPosts = blogPosts.map(p => p.id === post.id ? post : p);
    setBlogPosts(updatedPosts);
    localStorage.setItem('el_blog_posts', JSON.stringify(updatedPosts));
  };

  const deleteBlogPost = (id: string) => {
    const updatedPosts = blogPosts.filter(p => p.id !== id);
    setBlogPosts(updatedPosts);
    localStorage.setItem('el_blog_posts', JSON.stringify(updatedPosts));
  };

  // Resource actions
  const addResource = (resource: Omit<PremiumResource, 'id' | 'createdAt'>) => {
    const newResource: PremiumResource = {
      ...resource,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedResources = [newResource, ...resources];
    setResources(updatedResources);
    localStorage.setItem('el_resources', JSON.stringify(updatedResources));
  };

  const updateResource = (resource: PremiumResource) => {
    const updatedResources = resources.map(r => r.id === resource.id ? resource : r);
    setResources(updatedResources);
    localStorage.setItem('el_resources', JSON.stringify(updatedResources));
  };

  const deleteResource = (id: string) => {
    const updatedResources = resources.filter(r => r.id !== id);
    setResources(updatedResources);
    localStorage.setItem('el_resources', JSON.stringify(updatedResources));
  };

  // Payment simulation
  const processPayment = async (resourceId: string, amount: number, cardNumber: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject(new Error('You must be signed in to make a purchase.'));
          return;
        }

        // Basic mock validation: check if card has 16 digits
        const strippedCard = cardNumber.replace(/\s+/g, '');
        if (strippedCard.length !== 16 || isNaN(Number(strippedCard))) {
          reject(new Error('Invalid credit card number. Please enter a valid 16-digit card.'));
          return;
        }

        const targetResource = resources.find(r => r.id === resourceId);
        if (!targetResource) {
          reject(new Error('Resource not found.'));
          return;
        }

        // Record transaction
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          userId: currentUser.id,
          userEmail: currentUser.email,
          resourceId: targetResource.id,
          resourceTitle: targetResource.title,
          amount,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        const updatedTx = [newTransaction, ...transactions];
        setTransactions(updatedTx);
        localStorage.setItem('el_transactions', JSON.stringify(updatedTx));

        // Unlock resource
        const updatedUnlocked = [...unlockedResourceIds, resourceId];
        setUnlockedResourceIds(updatedUnlocked);
        localStorage.setItem(`el_unlocked_${currentUser.id}`, JSON.stringify(updatedUnlocked));

        resolve();
      }, 1500);
    });
  };

  const isResourceUnlocked = (resourceId: string) => {
    // Admins unlock everything automatically
    if (currentUser?.role === 'admin') return true;
    return unlockedResourceIds.includes(resourceId);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      blogPosts,
      resources,
      transactions,
      unlockedResourceIds,
      isLoading,
      signIn,
      signUp,
      signOut,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addResource,
      updateResource,
      deleteResource,
      processPayment,
      isResourceUnlocked
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
