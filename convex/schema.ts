import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations - multi-tenant support
  organizations: defineTable({
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),

  // Users
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    workosId: v.optional(v.string()),
    masterPasswordHash: v.optional(v.string()),
    role: v.optional(v.union(v.literal("super_admin"), v.literal("admin"), v.literal("editor"), v.literal("viewer"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"])
    .index("by_workosId", ["workosId"]),

  // Memberships - user organization relationship
  memberships: defineTable({
    userId: v.id("users"),
    organizationId: v.optional(v.id("organizations")),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_user_organization", ["userId", "organizationId"]),

  // Categories for organizing passwords
  categories: defineTable({
    organizationId: v.optional(v.id("organizations")),
    name: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_organization", ["organizationId"])
    .index("by_name", ["name"]),

  // Passwords - the core encrypted data
  passwords: defineTable({
    organizationId: v.optional(v.id("organizations")),
    name: v.string(),
    url: v.optional(v.string()),
    username: v.string(), // Encrypted
    password: v.string(), // Encrypted
    notes: v.optional(v.string()), // Encrypted
    categoryId: v.optional(v.id("categories")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  }).index("by_organization", ["organizationId"])
    .index("by_category", ["categoryId"])
    .index("by_createdBy", ["createdBy"])
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  // Password access - sharing relationships
  password_access: defineTable({
    passwordId: v.id("passwords"),
    userId: v.id("users"),
    accessLevel: v.union(v.literal("view"), v.literal("edit")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    revokedAt: v.optional(v.number()),
  }).index("by_password", ["passwordId"])
    .index("by_user", ["userId"])
    .index("by_password_user", ["passwordId", "userId"]),

  // Audit logs - compliance tracking
  audit_logs: defineTable({
    organizationId: v.optional(v.id("organizations")),
    userId: v.id("users"),
    action: v.union(
      v.literal("view"),
      v.literal("copy_username"),
      v.literal("copy_password"),
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("share"),
      v.literal("revoke"),
      v.literal("login"),
      v.literal("logout")
    ),
    targetType: v.union(v.literal("password"), v.literal("category"), v.literal("user"), v.literal("session")),
    targetId: v.optional(v.string()),
    details: v.optional(v.string()), // JSON string for additional context
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_target", ["targetType", "targetId"])
    .index("by_timestamp", ["timestamp"]),
});
