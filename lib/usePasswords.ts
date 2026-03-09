"use client";

import { useState, useEffect, useCallback } from "react";

// Password entry type matching the Convex schema
export interface PasswordEntry {
  _id: string;
  name: string;
  url?: string;
  username: string;
  password: string;
  notes?: string;
  categoryId?: string;
  categoryName?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  isFavorite?: boolean;
}

// Category type
export interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

// Password access for sharing
export interface PasswordAccess {
  userId: string;
  accessLevel: "view" | "edit";
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Local storage keys
const PASSWORDS_KEY = "tpm_passwords";
const CATEGORIES_KEY = "tpm_categories";
const PASSWORD_ACCESS_KEY = "tpm_password_access";

// Get all passwords (simulates Convex query)
export function usePasswords(userId: string | undefined) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPasswords = useCallback(() => {
    if (!userId) {
      setPasswords([]);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(PASSWORDS_KEY);
      const allPasswords: PasswordEntry[] = stored ? JSON.parse(stored) : [];
      
      // Get user's passwords (created by user or shared with user)
      const accessStored = localStorage.getItem(PASSWORD_ACCESS_KEY);
      const accesses: Array<{ passwordId: string; userId: string; revokedAt?: number }> = 
        accessStored ? JSON.parse(accessStored) : [];
      
      // Find passwords shared with this user
      const sharedWithUser = accesses
        .filter(a => a.userId === userId && !a.revokedAt)
        .map(a => a.passwordId);
      
      const userPasswords = allPasswords.filter(
        p => !p.deletedAt && (p.createdBy === userId || sharedWithUser.includes(p._id))
      );
      
      // Add categories
      const catStored = localStorage.getItem(CATEGORIES_KEY);
      const categories: Category[] = catStored ? JSON.parse(catStored) : [];
      
      const passwordsWithCategories = userPasswords.map(p => ({
        ...p,
        categoryName: p.categoryId 
          ? categories.find(c => c._id === p.categoryId)?.name 
          : undefined,
      }));
      
      setPasswords(passwordsWithCategories);
    } catch (e) {
      console.error("Error loading passwords:", e);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  // Listen for storage changes (for team sharing)
  useEffect(() => {
    const handleStorageChange = () => {
      loadPasswords();
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also poll for changes from same tab
    const interval = setInterval(loadPasswords, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [loadPasswords]);

  return { passwords, isLoading, refetch: loadPasswords };
}

// Create a password (simulates Convex mutation)
export function useCreatePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const createPassword = useCallback(async (data: {
    name: string;
    url?: string;
    username: string;
    password: string;
    notes?: string;
    categoryId?: string;
    userId: string;
  }) => {
    setIsLoading(true);
    
    try {
      const stored = localStorage.getItem(PASSWORDS_KEY);
      const passwords: PasswordEntry[] = stored ? JSON.parse(stored) : [];
      
      const now = Date.now();
      const newPassword: PasswordEntry = {
        _id: `pwd_${now}_${Math.random().toString(36).substr(2)}`,
        name: data.name,
        url: data.url,
        username: data.username,
        password: data.password,
        notes: data.notes,
        categoryId: data.categoryId,
        createdBy: data.userId,
        createdAt: now,
        updatedAt: now,
      };
      
      passwords.push(newPassword);
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
      
      setIsLoading(false);
      return newPassword;
    } catch (e) {
      console.error("Error creating password:", e);
      setIsLoading(false);
      throw e;
    }
  }, []);

  return { createPassword, isLoading };
}

// Update a password (simulates Convex mutation)
export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const updatePassword = useCallback(async (data: {
    id: string;
    name?: string;
    url?: string;
    username?: string;
    password?: string;
    notes?: string;
    categoryId?: string;
  }) => {
    setIsLoading(true);
    
    try {
      const stored = localStorage.getItem(PASSWORDS_KEY);
      const passwords: PasswordEntry[] = stored ? JSON.parse(stored) : [];
      
      const index = passwords.findIndex(p => p._id === data.id);
      if (index === -1) {
        throw new Error("Password not found");
      }
      
      passwords[index] = {
        ...passwords[index],
        ...(data.name !== undefined && { name: data.name }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.username !== undefined && { username: data.username }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        updatedAt: Date.now(),
      };
      
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
      
      setIsLoading(false);
      return passwords[index];
    } catch (e) {
      console.error("Error updating password:", e);
      setIsLoading(false);
      throw e;
    }
  }, []);

  return { updatePassword, isLoading };
}

// Delete a password (simulates Convex mutation)
export function useDeletePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const deletePassword = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      const stored = localStorage.getItem(PASSWORDS_KEY);
      const passwords: PasswordEntry[] = stored ? JSON.parse(stored) : [];
      
      const index = passwords.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error("Password not found");
      }
      
      // Soft delete
      passwords[index] = {
        ...passwords[index],
        deletedAt: Date.now(),
      };
      
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
      
      setIsLoading(false);
      return id;
    } catch (e) {
      console.error("Error deleting password:", e);
      setIsLoading(false);
      throw e;
    }
  }, []);

  return { deletePassword, isLoading };
}

// Share a password (simulates Convex mutation)
export function useSharePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const sharePassword = useCallback(async (data: {
    passwordId: string;
    recipientEmail: string;
    accessLevel: "view" | "edit";
    ownerId: string;
  }) => {
    setIsLoading(true);
    
    try {
      // Find recipient user
      const allUsers = JSON.parse(localStorage.getItem("tpm_all_users") || "[]");
      const recipient = allUsers.find((u: any) => u.email === data.recipientEmail);
      
      if (!recipient) {
        throw new Error("Recipient user not found. They need to register first.");
      }
      
      // Get existing access records
      const accessStored = localStorage.getItem(PASSWORD_ACCESS_KEY);
      let accesses: Array<{
        passwordId: string;
        userId: string;
        accessLevel: string;
        createdBy: string;
        createdAt: number;
        revokedAt?: number;
      }> = accessStored ? JSON.parse(accessStored) : [];
      
      // Check if already shared
      const existingIndex = accesses.findIndex(
        a => a.passwordId === data.passwordId && a.userId === recipient.id && !a.revokedAt
      );
      
      if (existingIndex !== -1) {
        // Update existing access
        accesses[existingIndex].accessLevel = data.accessLevel;
      } else {
        // Create new access
        accesses.push({
          passwordId: data.passwordId,
          userId: recipient.id,
          accessLevel: data.accessLevel,
          createdBy: data.ownerId,
          createdAt: Date.now(),
        });
      }
      
      localStorage.setItem(PASSWORD_ACCESS_KEY, JSON.stringify(accesses));
      
      setIsLoading(false);
      return { success: true };
    } catch (e) {
      console.error("Error sharing password:", e);
      setIsLoading(false);
      throw e;
    }
  }, []);

  return { sharePassword, isLoading };
}

// Get password access (who has access to a password)
export function usePasswordAccess(passwordId: string) {
  const [access, setAccess] = useState<PasswordAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccess = useCallback(() => {
    try {
      const accessStored = localStorage.getItem(PASSWORD_ACCESS_KEY);
      const accesses: Array<{
        passwordId: string;
        userId: string;
        accessLevel: string;
        createdBy: string;
        createdAt: number;
        revokedAt?: number;
      }> = accessStored ? JSON.parse(accessStored) : [];
      
      const allUsers = JSON.parse(localStorage.getItem("tpm_all_users") || "[]");
      
      const passwordAccesses = accesses
        .filter(a => a.passwordId === passwordId && !a.revokedAt)
        .map(a => {
          const user = allUsers.find((u: any) => u.id === a.userId);
          if (!user) return null;
          return {
            userId: a.userId,
            accessLevel: a.accessLevel as "view" | "edit",
            user: { id: user.id, email: user.email, name: user.name },
          };
        })
        .filter((a): a is PasswordAccess => a !== null);
      
      setAccess(passwordAccesses);
    } catch (e) {
      console.error("Error loading password access:", e);
    }
    setIsLoading(false);
  }, [passwordId]);

  useEffect(() => {
    loadAccess();
  }, [loadAccess]);

  return { access, isLoading, refetch: loadAccess };
}

// Get all users (for sharing)
export function useUsers() {
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const allUsers = JSON.parse(localStorage.getItem("tpm_all_users") || "[]");
      setUsers(allUsers);
    } catch (e) {
      console.error("Error loading users:", e);
    }
    setIsLoading(false);
  }, []);

  return { users, isLoading };
}

// Get all categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = useCallback(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      const cats: Category[] = stored ? JSON.parse(stored) : [];
      
      // Ensure default categories exist
      if (cats.length === 0) {
        const defaults: Category[] = [
          { _id: "cat_dev", name: "Development", icon: "code", color: "#10b981", createdAt: Date.now(), updatedAt: Date.now() },
          { _id: "cat_infra", name: "Infrastructure", icon: "server", color: "#f59e0b", createdAt: Date.now(), updatedAt: Date.now() },
          { _id: "cat_comm", name: "Communication", icon: "message", color: "#3b82f6", createdAt: Date.now(), updatedAt: Date.now() },
        ];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaults));
        setCategories(defaults);
      } else {
        setCategories(cats);
      }
    } catch (e) {
      console.error("Error loading categories:", e);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, isLoading };
}

// Create a category
export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);

  const createCategory = useCallback(async (data: { name: string; icon?: string; color?: string }) => {
    setIsLoading(true);
    
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      const categories: Category[] = stored ? JSON.parse(stored) : [];
      
      const now = Date.now();
      const newCategory: Category = {
        _id: `cat_${now}`,
        name: data.name,
        icon: data.icon,
        color: data.color,
        createdAt: now,
        updatedAt: now,
      };
      
      categories.push(newCategory);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      
      setIsLoading(false);
      return newCategory;
    } catch (e) {
      console.error("Error creating category:", e);
      setIsLoading(false);
      throw e;
    }
  }, []);

  return { createCategory, isLoading };
}

// Load demo passwords for testing
export function useLoadDemoPasswords() {
  const [isLoading, setIsLoading] = useState(false);

  const loadDemoPasswords = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // Check if demo data already exists
      const existingPasswords = localStorage.getItem(PASSWORDS_KEY);
      if (existingPasswords && JSON.parse(existingPasswords).length > 0) {
        setIsLoading(false);
        return;
      }

      const now = Date.now();

      // Create demo categories
      const demoCategories = [
        { _id: "cat_frontend", name: "Frontend", icon: "layout", color: "#3B82F6", createdAt: now, updatedAt: now },
        { _id: "cat_backend", name: "Backend", icon: "server", color: "#10B981", createdAt: now, updatedAt: now },
        { _id: "cat_devops", name: "DevOps", icon: "cloud", color: "#8B5CF6", createdAt: now, updatedAt: now },
        { _id: "cat_finance", name: "Finance", icon: "dollar-sign", color: "#F59E0B", createdAt: now, updatedAt: now },
        { _id: "cat_project", name: "Project Management", icon: "clipboard", color: "#EF4444", createdAt: now, updatedAt: now },
        { _id: "cat_design", name: "Design", icon: "palette", color: "#EC4899", createdAt: now, updatedAt: now },
      ];
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(demoCategories));

      // Create demo passwords
      const demoPasswords: PasswordEntry[] = [
        {
          _id: "pwd_1",
          name: "GitHub Repository",
          url: "https://github.com",
          username: "dev@company.com",
          password: "ghp_xxxxxxxxxxxx!",
          notes: "Main source code repository",
          categoryId: "cat_frontend",
          categoryName: "Frontend",
          createdBy: userId,
          createdAt: now - 86400000,
          updatedAt: now - 86400000,
          isFavorite: true,
        },
        {
          _id: "pwd_2",
          name: "Vercel Dashboard",
          url: "https://vercel.com",
          username: "team@company.com",
          password: "ver_xxxxxxxxxxxx!",
          notes: "Frontend deployment platform",
          categoryId: "cat_frontend",
          categoryName: "Frontend",
          createdBy: userId,
          createdAt: now - 86400000,
          updatedAt: now - 86400000,
        },
        {
          _id: "pwd_3",
          name: "Figma Design",
          url: "https://figma.com",
          username: "design@company.com",
          password: "fig_xxxxxxxxxxxx!",
          notes: "UI/UX design files",
          categoryId: "cat_design",
          categoryName: "Design",
          createdBy: userId,
          createdAt: now - 172800000,
          updatedAt: now - 172800000,
        },
        {
          _id: "pwd_4",
          name: "AWS Console",
          url: "https://aws.amazon.com",
          username: "admin@company.com",
          password: "aws_xxxxxxxxxxxx!",
          notes: "Cloud infrastructure",
          categoryId: "cat_backend",
          categoryName: "Backend",
          createdBy: userId,
          createdAt: now - 259200000,
          updatedAt: now - 259200000,
          isFavorite: true,
        },
        {
          _id: "pwd_5",
          name: "Database - PostgreSQL",
          url: "https://cloud.google.com/sql",
          username: "db_admin",
          password: "gcp_xxxxxxxxxxxx!",
          notes: "Production database",
          categoryId: "cat_backend",
          categoryName: "Backend",
          createdBy: userId,
          createdAt: now - 345600000,
          updatedAt: now - 345600000,
        },
        {
          _id: "pwd_6",
          name: "Stripe Payments",
          url: "https://dashboard.stripe.com",
          username: "finance@company.com",
          password: "str_xxxxxxxxxxxx!",
          notes: "Payment processing",
          categoryId: "cat_finance",
          categoryName: "Finance",
          createdBy: userId,
          createdAt: now - 432000000,
          updatedAt: now - 432000000,
        },
        {
          _id: "pwd_7",
          name: "Jira Project",
          url: "https://company.atlassian.net",
          username: "pm@company.com",
          password: "jira_xxxxxxxxxxxx!",
          notes: "Project tracking",
          categoryId: "cat_project",
          categoryName: "Project Management",
          createdBy: userId,
          createdAt: now - 518400000,
          updatedAt: now - 518400000,
        },
        {
          _id: "pwd_8",
          name: "Slack Workspace",
          url: "https://company.slack.com",
          username: "team@company.com",
          password: "slack_xxxxxxxx!",
          notes: "Team communication",
          categoryId: "cat_project",
          categoryName: "Project Management",
          createdBy: userId,
          createdAt: now - 604800000,
          updatedAt: now - 604800000,
        },
        {
          _id: "pwd_9",
          name: "Docker Hub",
          url: "https://hub.docker.com",
          username: "devops@company.com",
          password: "docker_xxxxxxxx!",
          notes: "Container registry",
          categoryId: "cat_devops",
          categoryName: "DevOps",
          createdBy: userId,
          createdAt: now - 691200000,
          updatedAt: now - 691200000,
        },
        {
          _id: "pwd_10",
          name: "CircleCI",
          url: "https://app.circleci.com",
          username: "ci@company.com",
          password: "circle_xxxxxxxx!",
          notes: "CI/CD pipelines",
          categoryId: "cat_devops",
          categoryName: "DevOps",
          createdBy: userId,
          createdAt: now - 777600000,
          updatedAt: now - 777600000,
        },
      ];

      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(demoPasswords));
      setIsLoading(false);
      return demoPasswords;
    } catch (e) {
      console.error("Error loading demo passwords:", e);
      setIsLoading(false);
    }
  }, []);

  return { loadDemoPasswords, isLoading };
}

// Force reload demo passwords (clears existing first)
export function useForceReloadDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const forceReloadDemo = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // Clear existing data
      localStorage.removeItem(PASSWORDS_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(PASSWORD_ACCESS_KEY);

      // Now load fresh demo data
      const now = Date.now();

      // Create demo categories
      const demoCategories = [
        { _id: "cat_frontend", name: "Frontend", icon: "layout", color: "#3B82F6", createdAt: now, updatedAt: now },
        { _id: "cat_backend", name: "Backend", icon: "server", color: "#10B981", createdAt: now, updatedAt: now },
        { _id: "cat_devops", name: "DevOps", icon: "cloud", color: "#8B5CF6", createdAt: now, updatedAt: now },
        { _id: "cat_finance", name: "Finance", icon: "dollar-sign", color: "#F59E0B", createdAt: now, updatedAt: now },
        { _id: "cat_project", name: "Project Management", icon: "clipboard", color: "#EF4444", createdAt: now, updatedAt: now },
        { _id: "cat_design", name: "Design", icon: "palette", color: "#EC4899", createdAt: now, updatedAt: now },
      ];
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(demoCategories));

      // Create demo passwords
      const demoPasswords: PasswordEntry[] = [
        {
          _id: "pwd_1",
          name: "GitHub Repository",
          url: "https://github.com",
          username: "dev@company.com",
          password: "ghp_xxxxxxxxxxxx!",
          notes: "Main source code repository",
          categoryId: "cat_frontend",
          categoryName: "Frontend",
          createdBy: userId,
          createdAt: now - 86400000,
          updatedAt: now - 86400000,
          isFavorite: true,
        },
        {
          _id: "pwd_2",
          name: "Vercel Dashboard",
          url: "https://vercel.com",
          username: "team@company.com",
          password: "ver_xxxxxxxxxxxx!",
          notes: "Frontend deployment platform",
          categoryId: "cat_frontend",
          categoryName: "Frontend",
          createdBy: userId,
          createdAt: now - 86400000,
          updatedAt: now - 86400000,
        },
        {
          _id: "pwd_3",
          name: "Figma Design",
          url: "https://figma.com",
          username: "design@company.com",
          password: "fig_xxxxxxxxxxxx!",
          notes: "UI/UX design files",
          categoryId: "cat_design",
          categoryName: "Design",
          createdBy: userId,
          createdAt: now - 172800000,
          updatedAt: now - 172800000,
        },
        {
          _id: "pwd_4",
          name: "AWS Console",
          url: "https://aws.amazon.com",
          username: "admin@company.com",
          password: "aws_xxxxxxxxxxxx!",
          notes: "Cloud infrastructure",
          categoryId: "cat_backend",
          categoryName: "Backend",
          createdBy: userId,
          createdAt: now - 259200000,
          updatedAt: now - 259200000,
          isFavorite: true,
        },
        {
          _id: "pwd_5",
          name: "Database - PostgreSQL",
          url: "https://cloud.google.com/sql",
          username: "db_admin",
          password: "gcp_xxxxxxxxxxxx!",
          notes: "Production database",
          categoryId: "cat_backend",
          categoryName: "Backend",
          createdBy: userId,
          createdAt: now - 345600000,
          updatedAt: now - 345600000,
        },
        {
          _id: "pwd_6",
          name: "Stripe Payments",
          url: "https://dashboard.stripe.com",
          username: "finance@company.com",
          password: "str_xxxxxxxxxxxx!",
          notes: "Payment processing",
          categoryId: "cat_finance",
          categoryName: "Finance",
          createdBy: userId,
          createdAt: now - 432000000,
          updatedAt: now - 432000000,
        },
        {
          _id: "pwd_7",
          name: "Jira Project",
          url: "https://company.atlassian.net",
          username: "pm@company.com",
          password: "jira_xxxxxxxxxxxx!",
          notes: "Project tracking",
          categoryId: "cat_project",
          categoryName: "Project Management",
          createdBy: userId,
          createdAt: now - 518400000,
          updatedAt: now - 518400000,
        },
        {
          _id: "pwd_8",
          name: "Slack Workspace",
          url: "https://company.slack.com",
          username: "team@company.com",
          password: "slack_xxxxxxxx!",
          notes: "Team communication",
          categoryId: "cat_project",
          categoryName: "Project Management",
          createdBy: userId,
          createdAt: now - 604800000,
          updatedAt: now - 604800000,
        },
        {
          _id: "pwd_9",
          name: "Docker Hub",
          url: "https://hub.docker.com",
          username: "devops@company.com",
          password: "docker_xxxxxxxx!",
          notes: "Container registry",
          categoryId: "cat_devops",
          categoryName: "DevOps",
          createdBy: userId,
          createdAt: now - 691200000,
          updatedAt: now - 691200000,
        },
        {
          _id: "pwd_10",
          name: "CircleCI",
          url: "https://app.circleci.com",
          username: "ci@company.com",
          password: "circle_xxxxxxxx!",
          notes: "CI/CD pipelines",
          categoryId: "cat_devops",
          categoryName: "DevOps",
          createdBy: userId,
          createdAt: now - 777600000,
          updatedAt: now - 777600000,
        },
      ];

      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(demoPasswords));
      setIsLoading(false);
      return demoPasswords;
    } catch (e) {
      console.error("Error loading demo passwords:", e);
      setIsLoading(false);
    }
  }, []);

  return { forceReloadDemo, isLoading };
}
