// Role types
export type Role = "super_admin" | "admin" | "editor" | "viewer";

// Password access levels
export type AccessLevel = "view" | "edit";

// Audit action types
export type AuditAction =
  | "view"
  | "copy_username"
  | "copy_password"
  | "create"
  | "update"
  | "delete"
  | "share"
  | "revoke"
  | "login"
  | "logout";

// Audit target types
export type AuditTargetType = "password" | "category" | "user" | "session";

// Password data type for UI
export interface PasswordData {
  id: string;
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
  isShared?: boolean;
  accessLevel?: AccessLevel;
}

// Category data type for UI
export interface CategoryData {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  passwordCount?: number;
  createdAt: number;
  updatedAt: number;
}

// User data type for UI
export interface UserData {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  createdAt: number;
}

// Membership data type for UI
export interface MembershipData {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  organizationId?: string;
  role: Role;
  createdAt: number;
}

// Audit log data type for UI
export interface AuditLogData {
  id: string;
  organizationId?: string;
  userId: string;
  userName?: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  targetName?: string;
  details?: string;
  timestamp: number;
}

// Password form data type
export interface PasswordFormData {
  name: string;
  url?: string;
  username: string;
  password: string;
  notes?: string;
  categoryId?: string;
  shareWith?: {
    userId: string;
    accessLevel: AccessLevel;
  }[];
}

// Category form data type
export interface CategoryFormData {
  name: string;
  icon?: string;
  color?: string;
}

// Organization data type
export interface OrganizationData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

// Search/filter types
export interface PasswordFilter {
  categoryId?: string;
  searchQuery?: string;
  accessType?: "mine" | "shared" | "all";
}

// Dashboard statistics
export interface DashboardStats {
  totalPasswords: number;
  totalCategories: number;
  totalTeamMembers: number;
  recentActivity: AuditLogData[];
}
