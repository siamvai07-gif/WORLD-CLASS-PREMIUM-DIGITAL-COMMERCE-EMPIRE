"use client";

import { getAllPaymentRequests, approvePayment, rejectPayment, logAdminAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={variants[status] || "bg-slate-100 text-slate-700"}>
      {status}
    </Badge>
  );
}

export default function PaymentsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getAllPaymentRequests();
    setRequests(data || []);
  }

  async function handleApprove(id: string) {
    setLoadingId(id);
    const fd = new FormData();
    fd.append("id", id);
    await approvePayment(fd);
    await logAdminAction("admin", "approve_payment", id, {});
    setLoadingId(null);
    load();
  }

  async function handleReject(id: string) {
    const note = prompt("Rejection reason (optional):");
    if (note === null) return;
    setLoadingId(id);
    const fd = new FormData();
    fd.append("id", id);
    await rejectPayment(fd);
    await logAdminAction("admin", "reject_payment", id, { note });
    setLoadingId(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Requests</h1>
          <p className="text-muted-foreground">Review and approve coin top-up payments</p>
        </div>
        <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">← Back to Dashboard</Link>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Reference</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-muted-foreground">
                    No payment requests.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="text-sm font-medium">{r.profiles?.full_name || r.profiles?.username || "User"}</div>
                      <div className="text-xs text-muted-foreground">{r.user_id}</div>
                    </TableCell>
                    <TableCell className="text-right">{r.method}</TableCell>
                    <TableCell className="text-right font-medium">৳{r.amount}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground truncate max-w-[150px]">{r.transaction_id}</TableCell>
                    <TableCell className="text-right"><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {r.status !== "pending" ? (
                        <span className="text-xs text-muted-foreground">Reviewed</span>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(r.id)}
                            disabled={loadingId === r.id}
                            className="text-green-600 border-green-100 hover:bg-green-50"
                          >
                            {loadingId === r.id ? <Loader2 className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(r.id)}
                            disabled={loadingId === r.id}
                            className="text-red-600 border-red-100 hover:bg-red-50"
                          >
                            {loadingId === r.id ? <Loader2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
