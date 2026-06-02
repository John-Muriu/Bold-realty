import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Insights = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Real Estate Insights
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Expert analysis, market trends, and investment advice from Bold Realty.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border group hover:shadow-lg transition-all duration-300">
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium mb-3">
                                        <span>Oct 24, 2024</span>
                                        <span>•</span>
                                        <span>Market Trends</span>
                                    </div>
                                    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        The Future of Luxury Real Estate in Nairobi
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Discover emerging trends and investment opportunities in Nairobi's prime residential areas.
                                    </p>
                                    <button className="text-primary text-sm font-medium hover:underline">
                                        Read Article →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Insights;
