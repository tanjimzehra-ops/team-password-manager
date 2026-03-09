import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all passwords for the current user
export const getPasswords = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return [];
    }

    // Get passwords created by the user
    const passwords = await ctx.db
      .query("passwords")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .collect();

    // Get shared passwords
    const sharedAccess = await ctx.db
      .query("password_access")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const sharedPasswordIds = sharedAccess
      .filter((access) => !access.revokedAt)
      .map((access) => access.passwordId);

    const sharedPasswords = await Promise.all(
      sharedPasswordIds.map((id) => ctx.db.get(id))
    );

    // Combine and deduplicate
    const allPasswords = [...passwords, ...(sharedPasswords.filter(Boolean) as any)];
    
    // Get categories for each password
    const passwordsWithCategories = await Promise.all(
      allPasswords.map(async (pwd: any) => {
        let categoryName = undefined;
        if (pwd.categoryId) {
          const category = await ctx.db.get(pwd.categoryId);
          categoryName = category?.name;
        }
        return { ...pwd, categoryName };
      })
    );

    return passwordsWithCategories;
  },
});

// Get a single password by ID
export const getPassword = query({
  args: {
    id: v.id("passwords"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const password = await ctx.db.get(args.id);
    if (!password) {
      return null;
    }

    // Get category
    let categoryName = undefined;
    if (password.categoryId) {
      const category = await ctx.db.get(password.categoryId);
      categoryName = category?.name;
    }

    return { ...password, categoryName };
  },
});

// Create a new password
export const createPassword = mutation({
  args: {
    name: v.string(),
    url: v.optional(v.string()),
    username: v.string(),
    password: v.string(),
    notes: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const passwordId = await ctx.db.insert("passwords", {
      name: args.name,
      url: args.url,
      username: args.username,
      password: args.password,
      notes: args.notes,
      categoryId: args.categoryId,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return passwordId;
  },
});

// Update a password
export const updatePassword = mutation({
  args: {
    id: v.id("passwords"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
    notes: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const password = await ctx.db.get(args.id);
    if (!password) {
      throw new Error("Password not found");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.url !== undefined) updates.url = args.url;
    if (args.username !== undefined) updates.username = args.username;
    if (args.password !== undefined) updates.password = args.password;
    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.categoryId !== undefined) updates.categoryId = args.categoryId;

    await ctx.db.patch(args.id, updates);

    return args.id;
  },
});

// Delete a password (soft delete)
export const deletePassword = mutation({
  args: {
    id: v.id("passwords"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
    });

    return args.id;
  },
});

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const categories = await ctx.db
      .query("categories")
      .order("name")
      .collect();

    return categories;
  },
});

// Create a new category
export const createCategory = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    const now = Date.now();
    const categoryId = await ctx.db.insert("categories", {
      name: args.name,
      icon: args.icon,
      color: args.color,
      createdBy: user?._id,
      createdAt: now,
      updatedAt: now,
    });

    return categoryId;
  },
});

// Share a password with another user
export const sharePassword = mutation({
  args: {
    passwordId: v.id("passwords"),
    recipientEmail: v.string(),
    accessLevel: v.union(v.literal("view"), v.literal("edit")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the recipient user
    const recipient = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.recipientEmail))
      .first();

    if (!recipient) {
      throw new Error("Recipient user not found");
    }

    // Check if already shared
    const existingAccess = await ctx.db
      .query("password_access")
      .withIndex("by_password_user", (q) => 
        q.eq("passwordId", args.passwordId).eq("userId", recipient._id)
      )
      .first();

    if (existingAccess && !existingAccess.revokedAt) {
      // Update existing access
      await ctx.db.patch(existingAccess._id, {
        accessLevel: args.accessLevel,
      });
      return existingAccess._id;
    }

    // Create new access
    const accessId = await ctx.db.insert("password_access", {
      passwordId: args.passwordId,
      userId: recipient._id,
      accessLevel: args.accessLevel,
      createdBy: user._id,
      createdAt: Date.now(),
    });

    return accessId;
  },
});

// Revoke access to a password
export const revokePasswordAccess = mutation({
  args: {
    passwordId: v.id("passwords"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const access = await ctx.db
      .query("password_access")
      .withIndex("by_password_user", (q) => 
        q.eq("passwordId", args.passwordId).eq("userId", args.userId)
      )
      .first();

    if (!access) {
      throw new Error("Access record not found");
    }

    await ctx.db.patch(access._id, {
      revokedAt: Date.now(),
    });

    return args.userId;
  },
});

// Get users who have access to a password
export const getPasswordAccess = query({
  args: {
    passwordId: v.id("passwords"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const accesses = await ctx.db
      .query("password_access")
      .withIndex("by_password", (q) => q.eq("passwordId", args.passwordId))
      .collect();

    // Filter out revoked access and get user details
    const validAccesses = accesses.filter((a) => !a.revokedAt);
    
    const usersWithAccess = await Promise.all(
      validAccesses.map(async (access) => {
        const u = await ctx.db.get(access.userId);
        return {
          userId: access.userId,
          accessLevel: access.accessLevel,
          user: u ? { id: u._id, email: u.email, name: u.name } : null,
        };
      })
    );

    return usersWithAccess;
  },
});
