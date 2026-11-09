"use client";

import { useState, useEffect } from "react";
import { getAllProducts, upsertProduct, deleteProduct, logAdminAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getAllProducts();
    setProducts(data);
  }

  async function save(formData: FormData) {
    setLoading(true);
    const res = await upsertProduct(formData);
    setLoading(false);
    if (res.success) {
      setOpen(false);
      setEditing(null);
      await logAdminAction("admin", editing ? "update_product" : "create_product", editing?.id, {});
      load();
    } else {
      alert(res.error || "Failed to save product");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const fd = new FormData();
    fd.append("id", id);
    await deleteProduct(fd);
    await logAdminAction("admin", "delete_product", id, {});
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground">Add, edit, or disable marketplace items</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Coins</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Featured</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-muted-foreground">
                    No products yet.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.description?.slice(0, 60)}</div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{Array.isArray(p.product_categories) ? p.product_categories[0]?.name : p.product_categories?.name}</TableCell>
                    <TableCell className="text-right text-sm font-medium">৳{p.price}</TableCell>
                    <TableCell className="text-right text-sm">{p.coin_price}</TableCell>
                    <TableCell className="text-right text-sm">{p.stock}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={p.is_featured ? "default" : "outline"} className="text-[10px]">
                        {p.is_featured ? "Featured" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={p.is_active ? "success" : "outline"} className="text-[10px]">
                        {p.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)} className="text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
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
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Manage a marketplace product</DialogDescription>
          </DialogHeader>
          <form action={save} className="space-y-4 p-4">
            <input name="id" defaultValue={editing?.id || ""} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editing?.title || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category ID</Label>
                <Input id="categoryId" name="categoryId" defaultValue={editing?.category_id || ""} placeholder="category uuid" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (BDT)</Label>
                <Input id="price" name="price" type="number" defaultValue={editing?.price || "0"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coinPrice">Coin Price</Label>
                <Input id="coinPrice" name="coinPrice" type="number" defaultValue={editing?.coin_price || "0"} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" defaultValue={editing?.stock || 0} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={editing?.image_url || ""} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" name="videoUrl" defaultValue={editing?.video_url || ""} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" defaultValue={editing?.description || ""} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <label className="text-sm flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" defaultChecked={editing?.is_active ?? true} className="form-checkbox" />
                Active
              </label>
              <label className="text-sm flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_featured" defaultChecked={editing?.is_featured ?? false} className="form-checkbox" />
                Featured
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Product"}
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


