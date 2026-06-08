import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_BLOGS, BlogPost } from "@/lib/mockBlogs";
import SEO from "@/components/seo/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Insights = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("blogs")
                .select("*")
                .order("published_at", { ascending: false });

            if (!error && data) {
                const dbBlogs = data.map((blog: any) => ({
                    id: blog.id,
                    date: new Date(blog.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }),
                    category: blog.category || "Market Trends",
                    title: blog.title,
                    excerpt: blog.excerpt || "",
                    image: blog.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                    author: "Bold Realty Team",
                    readTime: "5 min read",
                    slug: blog.slug,
                    content: blog.content || "",
                }));

                const combined = [...dbBlogs, ...MOCK_BLOGS];
                const seenSlugs = new Set<string>();
                const unique = combined.filter(b => {
                    const key = b.slug || b.id;
                    if (seenSlugs.has(key)) return false;
                    seenSlugs.add(key);
                    return true;
                });

                setBlogs(unique);
            } else {
                setBlogs(MOCK_BLOGS);
            }
            setLoading(false);
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Real Estate Insights & Investment Guides"
                description="Stay updated with the latest market trends, investment strategies, interior design tips, and property guides in Nairobi from Bold Realty."
                url="/insights"
                type="website"
            />
            <Header />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            Bold Realty Blog
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Real Estate Insights
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Expert analysis, market trends, and investment advice from the Bold Realty team.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                                    <div className="aspect-video bg-muted" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 bg-muted rounded w-1/3" />
                                        <div className="h-6 bg-muted rounded" />
                                        <div className="h-16 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    to={`/insights/${blog.slug || blog.id}`}
                                    className="bg-card rounded-2xl overflow-hidden border border-border group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="aspect-video bg-muted relative overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {blog.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {blog.readTime || "5 min read"}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                                            {blog.excerpt}
                                        </p>
                                        <span className="text-primary text-sm font-semibold hover:underline mt-auto inline-flex items-center gap-1">
                                            Read Article →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Home className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold text-xl text-foreground mb-2">No articles found</h3>
                            <p className="text-muted-foreground">Please check back later for more updates.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Insights;
