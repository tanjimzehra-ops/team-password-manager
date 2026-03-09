"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: number;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load team members from localStorage (for demo)
    // In production, this would come from Convex
    const storedMembers = localStorage.getItem("tpm_all_users");
    if (storedMembers) {
      const parsed = JSON.parse(storedMembers);
      setMembers(parsed);
    }
    setLoadingMembers(false);
  }, []);

  const updateRole = (userId: string, newRole: string) => {
    const updatedMembers = members.map((m) =>
      m.id === userId ? { ...m, role: newRole } : m
    );
    setMembers(updatedMembers);
    localStorage.setItem("tpm_all_users", JSON.stringify(updatedMembers));
    
    // Also update individual user storage
    const userKey = `tpm_user_${members.find((m) => m.id === userId)?.email}`;
    const userData = localStorage.getItem(userKey);
    if (userData) {
      const parsed = JSON.parse(userData);
      parsed.role = newRole;
      localStorage.setItem(userKey, JSON.stringify(parsed));
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check if user is admin/super_admin
  const isSuperAdmin = user.role === "super_admin" || user.role === "admin";

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">
              You don't have permission to access this page. Only administrators can manage team members.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Admin</h1>
              <p className="text-gray-500 mt-1">Manage your team members and their access</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {user.role === "super_admin" ? "👑 Super Admin" : "🛡️ Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-gray-900">{members.length}</div>
            <div className="text-gray-500">Total Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-gray-900">
              {members.filter((m) => m.role === "super_admin" || m.role === "admin").length}
            </div>
            <div className="text-gray-500">Admins</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-gray-900">
              {members.filter((m) => m.role === "editor").length}
            </div>
            <div className="text-gray-500">Editors</div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          </div>
          
          {loadingMembers ? (
            <div className="p-6 text-center text-gray-500">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No team members found. Share the registration link to invite people!
            </div>
          ) : (
            <div className="divide-y">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.name}
                        {member.id === user.id && (
                          <span className="ml-2 text-xs text-gray-500">(You)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {member.id === user.id ? (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {member.role === "super_admin" ? "👑 Super Admin" : "🛡️ Admin"}
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value)}
                        className="px-3 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="super_admin">👑 Super Admin</option>
                        <option value="admin">🛡️ Admin</option>
                        <option value="editor">✏️ Editor</option>
                        <option value="viewer">👁️ Viewer</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Members</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-3">
              Share this app URL with your team members. They can register themselves and join your team.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={typeof window !== "undefined" ? window.location.origin : ""}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-white text-gray-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  alert("URL copied to clipboard!");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
