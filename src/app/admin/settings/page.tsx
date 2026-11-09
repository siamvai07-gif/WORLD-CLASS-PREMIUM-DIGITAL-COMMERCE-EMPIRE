"use client";

import { useState, useEffect } from "react";
import { getAllSettings, upsertSetting, logAdminAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getAllSettings();
    setSettings(data);
  }

  async function save(key: string, formData: FormData) {
    const res = await upsertSetting(formData);
    if (res.success) {
      await logAdminAction("admin", "update_setting", key, {});
      load();
    } else {
      alert(res.error || "Failed to save setting");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Website Settings</h1>
        <p className="text-muted-foreground">Configure brand identity and site behavior</p>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((s: any) => (
                <TableRow key={s.key}>
                  <TableCell className="font-mono text-sm">{s.key}</TableCell>
                  <TableCell className="text-right">
                      <form action={(fd: FormData) => save(s.key, fd)} className="flex gap-2">
                        <input type="hidden" name="key" value={s.key} />
                      <input
                        name="value"
                        defaultValue={s.value}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <Button type="submit" size="sm">Save</Button>
                    </form>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {settings.length === 0 && (
                <TableRow>
                  <TableCell className="text-center py-8 text-muted-foreground">
                    No settings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground mb-4">Common Settings</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>site_name — Public site name</div>
          <div>site_title — SEO page title</div>
          <div>maintenance_mode — "true" to enable maintenance mode</div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
