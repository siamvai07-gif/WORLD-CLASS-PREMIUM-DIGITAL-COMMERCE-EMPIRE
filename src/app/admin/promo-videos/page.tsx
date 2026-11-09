"use client";

import { useState, useEffect } from "react";
import { getAllPromoVideos, upsertPromoVideo, logAdminAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PromoVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await getAllPromoVideos();
    setVideos(data);
  }

  async function save(formData: FormData) {
    setLoading(true);
    const res = await upsertPromoVideo(formData);
    setLoading(false);
    if (res.success) {
      setOpen(false);
      setEditing(null);
      await logAdminAction("admin", editing ? "update_promo_video" : "create_promo_video", editing?.id, {});
      load();
    } else {
      alert(res.error || "Failed to save video");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video?")) return;
    const fd = new FormData();
    fd.append("id", id);
    // upsert doesn't support delete; mark inactive instead
    await upsertPromoVideo(new FormData());
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotional Videos</h1>
          <p className="text-muted-foreground">Manage homepage video carousel content</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Description</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Order</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-muted-foreground">
                    No videos yet.
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((v: any) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="text-sm font-medium">{v.title}</div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground truncate max-w-[200px]">{v.description}</TableCell>
                    <TableCell className="text-right text-sm">{v.duration}</TableCell>
                    <TableCell className="text-right text-sm">{v.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={v.is_active ? "success" : "outline"} className="text-[10px]">
                        {v.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(v); setOpen(true); }}>
                        <Edit className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Video" : "Add Video"}</DialogTitle>
            <DialogDescription>Promotional video shown on the homepage carousel</DialogDescription>
          </DialogHeader>
          <form action={save} className="space-y-4 p-4">
            <input name="id" defaultValue={editing?.id || ""} />
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={editing?.title || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={editing?.description || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input id="thumbnailUrl" name="thumbnailUrl" defaultValue={editing?.thumbnail_url || ""} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" name="videoUrl" defaultValue={editing?.video_url || ""} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" defaultValue={editing?.duration || ""} placeholder="0:45" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <label className="text-sm flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked={editing?.is_active ?? true} className="form-checkbox" />
                Active
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}


