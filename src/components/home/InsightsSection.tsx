import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BLOGS } from "@/lib/mockBlogs";

const InsightsSection = () => {
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left">
                        <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block">
                            Latest News
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                            Insights & Trends
                        </h2>
                    </div>
                    <Button variant="outline" asChild>
                        <Link to="/insights">
                            View All Articles
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_BLOGS.slice(0, 3).map((item) => (
                        <Link
                            key={item.id}
                            to={`/insights/${item.slug || item.id}`}
                            className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                        >
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                    <Calendar className="w-3 h-3" />
                                    <span>{item.date}</span>
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                    {item.excerpt}
                                </p>
                                <div className="flex items-center text-primary text-sm font-medium">
                                    Read More <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InsightsSection;
