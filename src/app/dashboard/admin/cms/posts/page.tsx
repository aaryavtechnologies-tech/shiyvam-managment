"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createPostAction, updatePostAction, deletePostAction } from "@/actions/admin/cms";
import { QuillEditor } from "@/components/ui/quill-editor";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author_name: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
};

export default function PostsPage() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "blog",
    excerpt: "",
    content: "",
    author_name: "",
    image_url: "",
    is_published: false,
  });

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();
    const { data: posts, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (posts) setData(posts);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt || "",
        content: post.content,
        author_name: post.author_name || "",
        image_url: post.image_url || "",
        is_published: post.is_published,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        category: "blog",
        excerpt: "",
        content: "",
        author_name: "",
        image_url: "",
        is_published: false,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Title, Slug, and Content are required");
      return;
    }

    const res = editingPost 
      ? await updatePostAction(editingPost.id, formData)
      : await createPostAction(formData);

    if (res.success) {
      toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully`);
      setModalOpen(false);
      fetchData();
    } else {
      toast.error(res.error || "Failed to save post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await deletePostAction(id);
    if (res.success) {
      toast.success("Post deleted");
      fetchData();
    } else {
      toast.error(res.error || "Failed to delete post");
    }
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <span className="font-bold">{row.getValue("title")}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const cat = row.getValue("category") as string;
        return (
          <Badge variant="outline" className={cat === 'blog' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-purple-200 text-purple-700 bg-purple-50'}>
            {cat === 'blog' ? 'Blog' : 'Career Advice'}
          </Badge>
        );
      }
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_published") ? "default" : "secondary"}>
          {row.getValue("is_published") ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => <span className="text-muted-foreground">{format(new Date(row.getValue("created_at")), "MMM d, yyyy")}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(row.original)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Posts & Articles</h1>
          <p className="text-muted-foreground font-medium">Manage your blog and career advice content.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-border p-6">
        <DataTable columns={columns} data={data} searchKey="title" />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, title, slug: editingPost ? formData.slug : slug });
                  }} 
                  placeholder="Post title" 
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input 
                  value={formData.slug} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                  placeholder="post-url-slug" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val as string })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="career_advice">Career Advice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input 
                  value={formData.author_name} 
                  onChange={e => setFormData({ ...formData, author_name: e.target.value })} 
                  placeholder="John Doe" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input 
                value={formData.image_url} 
                onChange={e => setFormData({ ...formData, image_url: e.target.value })} 
                placeholder="https://example.com/image.jpg" 
              />
            </div>

            <div className="space-y-2">
              <Label>Excerpt (Short Description)</Label>
              <Input 
                value={formData.excerpt} 
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
                placeholder="A brief summary of the post..." 
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <QuillEditor 
                value={formData.content} 
                onChange={content => setFormData({ ...formData, content })} 
              />
            </div>

            <div className="flex items-center gap-2 bg-muted p-4 rounded-xl border border-border">
              <Switch 
                checked={formData.is_published}
                onCheckedChange={checked => setFormData({ ...formData, is_published: checked })}
              />
              <Label className="font-bold">Publish immediately</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
