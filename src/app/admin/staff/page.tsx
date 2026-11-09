"use client";

import { useState, useEffect } from "react";
import { getAllStaff, updateStaffRole, logAdminAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserPlus } from "lucide-react";

const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "advertiser", label: "Advertiser (Staff)" },
  { value: "promoter", label: "Promoter (Staff)" },
  { value: "super_admin", label: "Super Admin" },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getAllStaff();
    setStaff(data || []);
  }

  async function changeRole(userId: string, role: string) {
    setUpdating(userId);
    const fd = new FormData();
    fd.append("userId", userId);
    fd.append("role", role);
    const res = await updateStaffRole(fd);
    if (res.success) {
      load();
    } else {
      alert(res.error || "Failed to update role");
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Assign granular staff roles and permissions</p>
        </div>
        <Button variant="outline" size="sm">
          <UserPlus className="w-3 h-3 mr-1" /> Invite Staff
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead className="text-right">Email</TableHead>
                <TableHead className="text-right">Role</TableHead>
                <TableHead className="text-right">Permissions</TableHead>
                <TableHead className="text-right">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-muted-foreground">
                    No staff members yet.
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="text-sm font-medium">{s.full_name || s.username || "User"}</div>
                      <div className="text-xs text-muted-foreground">@{s.username}</div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{s.email}</TableCell>
                    <TableCell className="text-right">
                      <select
                        value={s.role}
                        onChange={(e) => changeRole(s.id, e.target.value)}
                        disabled={updating === s.id}
                        className="text-xs rounded-md border border-input bg-background px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {rolePermissions(s.role).join(", ")}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={s.role === "super_admin" ? "destructive" : s.role === "customer" ? "outline" : "secondary"} className="text-[10px] uppercase">
                        {s.role === "customer" ? "Customer" : "Staff"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground mb-4">Granular Permissions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Roles map to permission sets. All permission checks are enforced server-side via RLS and
          server actions. Only the Master Admin can grant or revoke staff roles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: "Advertiser", perms: ["Add products", "Edit products", "Manage campaigns", "View analytics"] },
            { role: "Promoter", perms: ["Manage community posts", "Moderate comments", "View analytics"] },
            { role: "Super Admin", perms: ["All permissions", "Manage staff", "Audit logs", "Website settings"] },
          ].map((r) => (
            <div key={r.role} className="p-4 rounded-xl border border-border bg-muted/5">
              <div className="font-medium text-foreground mb-2">{r.role}</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {r.perms.map((p) => (
                  <li key={p} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function rolePermissions(role: string) {
  switch (role) {
    case "super_admin": return ["All admin functions"];
    case "advertiser": return ["Products", "Campaigns", "Analytics"];
    case "promoter": return ["Community", "Moderation"];
    default: return ["No staff permissions"];
  }
}


