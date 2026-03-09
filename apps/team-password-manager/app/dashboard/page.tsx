"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Copy, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  LogOut,
  Shield,
  KeyRound,
  Folder,
  ExternalLink,
  Star,
  Share2,
  Users,
  Loader2,
  RotateCw
} from "lucide-react";
import {
  usePasswords,
  useCreatePassword,
  useUpdatePassword,
  useDeletePassword,
  useSharePassword,
  useUsers,
  useCategories,
  useLoadDemoPasswords,
  useForceReloadDemo,
  PasswordEntry
} from "@/lib/usePasswords";

// Password Generator function
function generatePassword(
  length: number,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  let chars = "";
  if (includeUppercase) chars += uppercase;
  if (includeLowercase) chars += lowercase;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;
  
  if (chars === "") chars = lowercase; // Fallback
  
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  
  // Use Convex-like hooks for password management
  const { passwords, isLoading: passwordsLoading, refetch } = usePasswords(user?.id);
  const { createPassword, isLoading: creating } = useCreatePassword();
  const { updatePassword, isLoading: updating } = useUpdatePassword();
  const { deletePassword, isLoading: deleting } = useDeletePassword();
  const { sharePassword, isLoading: sharing } = useSharePassword();
  const { users } = useUsers();
  const { categories } = useCategories();
  const { loadDemoPasswords } = useLoadDemoPasswords();
  const { forceReloadDemo } = useForceReloadDemo();

  const handleLoadDemo = async () => {
    if (user?.id) {
      await forceReloadDemo(user.id);
      window.location.reload();
    }
  };
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sharingPassword, setSharingPassword] = useState<PasswordEntry | null>(null);
  const [shareWithEmail, setShareWithEmail] = useState("");
  const [shareAccessLevel, setShareAccessLevel] = useState<"view" | "edit">("view");
  const [shareError, setShareError] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredPasswords = passwords.filter((pwd) => {
    const matchesSearch = pwd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pwd.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pwd.url?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "all" || pwd.categoryName === selectedCategory;
    const matchesFavorite = !showFavoritesOnly || pwd.isFavorite === true;
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const toggleFavorite = (id: string) => {
    // Toggle favorite - this would be a mutation in real Convex
    const pwd = passwords.find(p => p._id === id);
    if (pwd) {
      updatePassword({
        id,
        name: pwd.name, // Trigger update
      });
    }
  };

  const handleShare = (password: PasswordEntry) => {
    setSharingPassword(password);
    setShareWithEmail("");
    setShareAccessLevel("view");
    setShareError("");
    setShareSuccess(false);
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shareWithEmail && sharingPassword && user) {
      try {
        setShareError("");
        await sharePassword({
          passwordId: sharingPassword._id,
          recipientEmail: shareWithEmail,
          accessLevel: shareAccessLevel,
          ownerId: user.id,
        });
        setShareSuccess(true);
        setTimeout(() => {
          setSharingPassword(null);
          setShareWithEmail("");
          setShareSuccess(false);
        }, 1500);
      } catch (error: any) {
        setShareError(error.message || "Failed to share password");
      }
    }
  };

  // Get unique categories from passwords and categories list
  const categoryList = Array.from(new Set([
    ...passwords.map((p) => p.categoryName).filter(Boolean),
    ...categories.map((c) => c.name)
  ]));

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${type} copied to clipboard`);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDeletePassword = async (id: string) => {
    if (confirm("Are you sure you want to delete this password?")) {
      await deletePassword(id);
    }
  };

  const handleSavePassword = async (password: PasswordEntry) => {
    if (editingPassword) {
      await updatePassword({
        id: editingPassword._id,
        name: password.name,
        url: password.url,
        username: password.username,
        password: password.password,
        notes: password.notes,
      });
      setEditingPassword(null);
    } else if (user) {
      await createPassword({
        name: password.name,
        url: password.url,
        username: password.username,
        password: password.password,
        notes: password.notes,
        userId: user.id,
      });
      setIsAddDialogOpen(false);
    }
  };

  // Get the category ID by name
  const getCategoryIdByName = (name: string): string | undefined => {
    const cat = categories.find(c => c.name === name);
    return cat?._id;
  };

  const isLoading = authLoading || passwordsLoading || creating || updating || deleting || sharing;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Team Password Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" title="Team members can see shared passwords">
              <Users className="h-4 w-4 mr-2" />
              Team ({users.length})
            </Button>
            {(user.role === "super_admin" || user.role === "admin") && (
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/admin")}>
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.name} 
                <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {user.role === "super_admin" ? "👑 Super Admin" : user.role === "admin" ? "🛡️ Admin" : user.role === "editor" ? "✏️ Editor" : "👁️ Viewer"}
                </span>
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Passwords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{passwords.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-yellow-400" : ""}`} />
              Favorites
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadDemo}
            >
              <Plus className="h-4 w-4 mr-2" />
              Load Demo
            </Button>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Password
            </Button>
          </div>
        </div>

        {/* Password List */}
        <div className="space-y-4">
          {filteredPasswords.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <KeyRound className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No passwords found</p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first password
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPasswords.map((pwd) => (
              <Card key={pwd._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(pwd._id)}
                          className="p-0 h-8 w-8"
                        >
                          <Star className={`h-4 w-4 ${pwd.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                        </Button>
                        <h3 className="text-lg font-semibold">{pwd.name}</h3>
                        {pwd.categoryName && (
                          <Badge variant="secondary">
                            <Folder className="h-3 w-3 mr-1" />
                            {pwd.categoryName}
                          </Badge>
                        )}
                        {pwd.url && (
                          <a
                            href={pwd.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-20">Username:</span>
                          <span className="font-mono">{pwd.username}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(pwd.username, "Username")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-20">Password:</span>
                          <span className="font-mono">
                            {showPasswords[pwd._id] ? pwd.password : "••••••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(pwd._id)}
                          >
                            {showPasswords[pwd._id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(pwd.password, "Password")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {pwd.notes && (
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground w-20">Notes:</span>
                            <span className="text-muted-foreground">{pwd.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(pwd)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPassword(pwd)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePassword(pwd._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {(isAddDialogOpen || editingPassword) && (
        <PasswordDialog
          password={editingPassword}
          onSave={handleSavePassword}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingPassword(null);
          }}
        />
      )}

      {/* Share Dialog */}
      {sharingPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Share Password</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share "{sharingPassword.name}" with a team member
              </p>
              <form onSubmit={handleShareSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shareEmail">Team Member Email</Label>
                  <Input
                    id="shareEmail"
                    type="email"
                    value={shareWithEmail}
                    onChange={(e) => setShareWithEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setSharingPassword(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Password Dialog Component
function PasswordDialog({
  password,
  onSave,
  onClose,
}: {
  password: PasswordEntry | null;
  onSave: (pwd: PasswordEntry) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(password?.name || "");
  const [url, setUrl] = useState(password?.url || "");
  const [username, setUsername] = useState(password?.username || "");
  const [pwdPassword, setPwdPassword] = useState(password?.password || "");
  const [notes, setNotes] = useState(password?.notes || "");
  const [categoryName, setCategoryName] = useState(password?.categoryName || "");
  
  // Password generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const handleGenerate = () => {
    const newPwd = generatePassword(genLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    setPwdPassword(newPwd);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      _id: password?._id || "",
      name,
      url,
      username,
      password: pwdPassword,
      notes,
      categoryName,
      createdBy: password?.createdBy || "",
      createdAt: password?.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle>{password ? "Edit Password" : "Add New Password"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., GitHub"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={pwdPassword}
                  onChange={(e) => setPwdPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGenerator(!showGenerator)}
                  title="Generate password"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Password Generator Panel */}
              {showGenerator && (
                <div className="mt-3 p-4 bg-muted rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password Generator</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerate}
                    >
                      <RotateCw className="h-4 w-4 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Length: {genLength}</Label>
                    <input
                      type="range"
                      id="length"
                      min="8"
                      max="64"
                      value={genLength}
                      onChange={(e) => setGenLength(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                      />
                      Uppercase (A-Z)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                      />
                      Lowercase (a-z)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                      />
                      Numbers (0-9)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                      />
                      Symbols (!@#$%)
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Development"
                list="categories"
              />
              <datalist id="categories">
                <option value="Development" />
                <option value="Infrastructure" />
                <option value="Communication" />
                <option value="Finance" />
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {password ? "Save Changes" : "Add Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
