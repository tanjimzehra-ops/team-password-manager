"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, ConvexReactClient } from "convex/react";
import { useRouter } from "next/navigation";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://powerful-panda-392.convex.cloud";
const convex = new ConvexReactClient(CONVEX_URL);

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "super_admin" | "admin" | "editor" | "viewer";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  convex: ConvexReactClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "tpm_user";

// Simple hash function for demo (in production use bcrypt or similar)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Check for existing session
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setSessionToken(parsed.token);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Store token in memory for Convex calls
  useEffect(() => {
    if (sessionToken) {
      localStorage.setItem("tpm_session", sessionToken);
    } else {
      localStorage.removeItem("tpm_session");
    }
  }, [sessionToken]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For demo purposes, check localStorage for registered users
      // In production, this would call a Convex mutation
      const stored = localStorage.getItem(`tpm_user_${email}`);
      if (!stored) {
        // Check if user exists from previous session
        const allUsers = localStorage.getItem("tpm_all_users");
        if (!allUsers) {
          setIsLoading(false);
          return false;
        }
      }

      const userData = stored ? JSON.parse(stored) : null;
      
      if (userData) {
        const passwordHash = await hashPassword(password);
        if (passwordHash === userData.passwordHash || password === userData.password) {
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role || "editor",
          };
          
          const token = `session_${Date.now()}_${Math.random().toString(36).substr(2)}`;
          setUser(user);
          setSessionToken(token);
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
          setIsLoading(false);
          return true;
        }
      }
      
      // For demo: accept any login and create user if doesn't exist
      const demoUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
        role: "editor",
      };
      
      const demoToken = `session_${Date.now()}_${Math.random().toString(36).substr(2)}`;
      setUser(demoUser);
      setSessionToken(demoToken);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: demoUser, token: demoToken }));
      
      // Also store for future login checks
      const passwordHash = await hashPassword(password);
      localStorage.setItem(`tpm_user_${email}`, JSON.stringify({
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        passwordHash,
      }));
      
      // Track all users
      const allUsers = JSON.parse(localStorage.getItem("tpm_all_users") || "[]");
      if (!allUsers.find((u: any) => u.email === email)) {
        allUsers.push({ id: demoUser.id, email: demoUser.email, name: demoUser.name });
        localStorage.setItem("tpm_all_users", JSON.stringify(allUsers));
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const passwordHash = await hashPassword(password);
      
      // Check if this is the first user - make them super_admin
      const allUsers = JSON.parse(localStorage.getItem("tpm_all_users") || "[]");
      const isFirstUser = allUsers.length === 0;
      const userRole: "super_admin" | "admin" | "editor" | "viewer" = isFirstUser ? "super_admin" : "editor";
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: userRole,
      };
      
      const token = `session_${Date.now()}_${Math.random().toString(36).substr(2)}`;
      setUser(newUser);
      setSessionToken(token);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token }));
      
      // Store user credentials with role
      localStorage.setItem(`tpm_user_${email}`, JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        passwordHash,
        role: userRole,
      }));
      
      // Track all users with roles
      allUsers.push({ id: newUser.id, email: newUser.email, name: newUser.name, role: userRole });
      localStorage.setItem("tpm_all_users", JSON.stringify(allUsers));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("tpm_session");
    setUser(null);
    setSessionToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, convex }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { convex };
