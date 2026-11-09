import { getAdminActions } from "@/lib/admin-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search } from "lucide-react";

export default async function AuditLogsPage() {
  const logs = await getAdminActions(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search actions..."
            className="pl-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Staff</TableHead>
                <TableHead className="text-right">Action</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-muted-foreground">
                    No audit log entries yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(l.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {l.profiles?.full_name || l.profiles?.username || "Admin"} ({l.admin_id})
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">{l.action}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground truncate max-w-[150px]">{l.target}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground truncate max-w-[200px]">
                      {JSON.stringify(l.meta || {})}
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
