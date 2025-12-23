import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

/**
 * @notice Using 'any' cast for 'blogs' table operations until Supabase types are regenerated.
 */

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "Market Trends",
        excerpt: "",
        content: "",
        image_url: "",
    });

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        const { data } = await supabase.from("blogs" as any).select("*").eq("id", id).single();
        if (data) {
            setFormData(data);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, title, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (id) {
            const { error } = await supabase.from("blogs" as any).update(formData).eq("id", id);
            if (error) {
                toast.error("Error updating post");
            } else {
                toast.success("Post updated successfully");
                navigate("/admin/blogs");
            }
        } else {
            const { error } = await supabase.from("blogs" as any).insert([formData]);
            if (error) {
                toast.error("Error creating post");
            } else {
                toast.success("Post created successfully");
                navigate("/admin/blogs");
            }
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => navigate("/admin/blogs")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold font-display text-gray-900">
                    {id ? "Edit Post" : "New Blog Post"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input name="title" value={formData.title} onChange={handleTitleChange} required placeholder="e.g. 5 Tips for Buying Land" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <Input name="slug" value={formData.slug} onChange={handleChange} required placeholder="e.g. 5-tips-buying-land" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="Market Trends">Market Trends</option>
                            <option value="Investment">Investment</option>
                            <option value="Interior Design">Interior Design</option>
                            <option value="Legal">Legal</option>
                            <option value="Lifestyle">Lifestyle</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Excerpt (Short Summary)</label>
                        <Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="h-24" required />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <Textarea name="content" value={formData.content} onChange={handleChange} className="h-64 font-mono text-sm" required placeholder="Write your article in Markdown..." />
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <Button type="submit" variant="gold" size="lg" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Publishing..." : "Publish Post"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
