import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Facebook, Twitter, Linkedin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_BLOGS, BlogPost } from "@/lib/mockBlogs";
import { MOCK_PROPERTIES } from "@/lib/mockProperties";
import { generateBlogSchema, getPropertyUrl } from "@/utils/seo-utils";
import SEO from "@/components/seo/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const BlogDetail = () => {
    const { slug, id } = useParams<{ slug?: string; id?: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProperties, setRelatedProperties] = useState<any[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const lookup = slug || id;
            if (!lookup) return;

            // 1. Try mock blogs
            const mockPost = MOCK_BLOGS.find(p => p.slug === lookup || p.id === lookup);
            if (mockPost) {
                setPost(mockPost);
                setLoading(false);
                return;
            }

            // 2. Try Supabase
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lookup);
            let data = null;
            let error = null;

            if (isUuid) {
                const res = await supabase.from("blogs").select("*").eq("id", lookup).maybeSingle();
                data = res.data;
                error = res.error;
            } else {
                const res = await supabase.from("blogs").select("*").eq("slug", lookup).maybeSingle();
                data = res.data;
                error = res.error;

                // Fallback: if not found by slug, check if any blog matches by generated title slug
                if (!data && !error) {
                    const { data: allBlogs, error: allBlogsError } = await supabase.from("blogs").select("*");
                    if (!allBlogsError && allBlogs) {
                        const matched = allBlogs.find(b => {
                            const genSlug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            return genSlug === lookup;
                        });
                        if (matched) {
                            data = matched;
                        }
                    }
                }
            }

            if (!error && data) {
                const blog = data;
                setPost({
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
                    keywords: blog.keywords || "Nairobi real estate, property investment, Bold Realty",
                    content: blog.content || "",
                });
            }
            setLoading(false);
        };

        fetchPost();
    }, [id, slug]);

    // Fetch related listings based on location/category keywords
    useEffect(() => {
        if (!post) return;

        const fetchRelated = async () => {
            const textToScan = `${post.title} ${post.category} ${post.excerpt}`.toLowerCase();
            let locationKeyword = "";
            if (textToScan.includes("westlands")) locationKeyword = "Westlands";
            else if (textToScan.includes("kilimani")) locationKeyword = "Kilimani";
            else if (textToScan.includes("karen")) locationKeyword = "Karen";
            else if (textToScan.includes("lavington")) locationKeyword = "Lavington";
            else if (textToScan.includes("runda")) locationKeyword = "Runda";
            else if (textToScan.includes("riverside")) locationKeyword = "Riverside";

            // Query Supabase
            let query = supabase.from("properties").select("*");
            if (locationKeyword) {
                query = query.ilike("location", `%${locationKeyword}%`);
            }
            const { data } = await query.limit(3);

            if (data && data.length > 0) {
                setRelatedProperties(data);
            } else {
                // Fallback to MOCK_PROPERTIES
                let filteredMocks = MOCK_PROPERTIES;
                if (locationKeyword) {
                    filteredMocks = MOCK_PROPERTIES.filter(p =>
                        p.location.toLowerCase().includes(locationKeyword.toLowerCase())
                    );
                }
                setRelatedProperties(filteredMocks.slice(0, 3));
            }
        };

        fetchRelated();
    }, [post]);

    // Injects SEO-friendly internal linking for important location & property keywords
    const injectInternalLinks = (htmlContent: string) => {
        if (!htmlContent) return "";

        const keywordsToLinks = [
            { keyword: "Westlands", link: "/properties?location=Westlands" },
            { keyword: "Kilimani", link: "/properties?location=Kilimani" },
            { keyword: "Karen", link: "/properties?location=Karen" },
            { keyword: "Lavington", link: "/properties?location=Lavington" },
            { keyword: "Runda", link: "/properties?location=Runda" },
            { keyword: "off-plan", link: "/properties?status=off-plan" },
            { keyword: "luxury real estate", link: "/properties?property_type=Villa" },
            { keyword: "apartments", link: "/properties?property_type=Apartment" }
        ];

        let processed = htmlContent;
        keywordsToLinks.forEach(({ keyword, link }) => {
            // Match word boundary but avoid matching inside HTML tags, href, or already linked texts
            const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>)(?![^<>]*</a>)`, "gi");
            processed = processed.replace(regex, `<a href="${link}" class="text-primary hover:underline font-semibold">$1</a>`);
        });

        return processed;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="pt-32 pb-20 flex-grow">
                    <div className="container mx-auto px-4 max-w-4xl animate-pulse space-y-6">
                        <div className="h-6 bg-muted rounded w-24" />
                        <div className="h-12 bg-muted rounded w-3/4" />
                        <div className="h-6 bg-muted rounded w-1/2" />
                        <div className="aspect-video bg-muted rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-5/6" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="pt-32 pb-20 flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold font-display text-foreground mb-4">Blog Post Not Found</h1>
                        <p className="text-muted-foreground mb-6">The article you are looking for does not exist or has been removed.</p>
                        <Button variant="gold" asChild>
                            <Link to="/insights">
                                Return to Insights
                            </Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const postSchema = generateBlogSchema(post) || undefined;

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={post.title}
                description={post.excerpt}
                keywords={post.keywords}
                image={post.image}
                url={`/insights/${post.slug || post.id}`}
                type="blog"
                schema={postSchema}
            />

            <Header />

            <main className="pt-32 pb-20">
                <article className="container mx-auto px-4 max-w-4xl">
                    {/* Back Button */}
                    <Link
                        to="/insights"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Insights
                    </Link>

                    {/* Category and Reading Time */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Clock className="w-4 h-4" />
                            {post.readTime || "5 min read"}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 pb-8 border-b border-border mb-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{post.date}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                            By {post.author}
                        </span>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-soft">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content with auto internal links */}
                    <div
                        className="prose prose-lg max-w-none
                            prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                            prose-p:text-muted-foreground prose-p:leading-relaxed
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-foreground prose-strong:font-semibold"
                        dangerouslySetInnerHTML={{ __html: injectInternalLinks(post.content) }}
                    />

                    {/* Related Listings Widget */}
                    {relatedProperties.length > 0 && (
                        <div className="mt-16 p-8 bg-muted/40 rounded-2xl border border-border shadow-soft">
                            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                                Featured Related Listings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProperties.map((prop) => (
                                    <div key={prop.id} className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-background flex flex-col h-full group">
                                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                            <img 
                                                src={prop.image_url || (prop.images && prop.images[0]) || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"} 
                                                alt={prop.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">{prop.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-3">{prop.location}</p>
                                            <div className="flex justify-between items-center mt-auto">
                                                <span className="text-primary font-bold text-sm">
                                                    {prop.price_label || `KES ${(prop.price / 1000000).toFixed(1)}M`}
                                                </span>
                                                <Link 
                                                    to={getPropertyUrl(prop)} 
                                                    className="text-xs font-semibold text-foreground hover:text-primary inline-flex items-center gap-0.5"
                                                >
                                                    Details →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-border">
                        <h3 className="font-display text-xl font-semibold mb-4">Share this article</h3>
                        <div className="flex gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Related Posts CTA */}
                    <div className="mt-16 p-8 bg-card rounded-2xl border border-border text-center shadow-soft">
                        <h3 className="font-display text-2xl font-bold mb-4">
                            Explore More Insights
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
                            Discover more articles about real estate trends, investment opportunities, and market insights.
                        </p>
                        <Button variant="gold" asChild>
                            <Link to="/insights">
                                View All Articles
                            </Link>
                        </Button>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
