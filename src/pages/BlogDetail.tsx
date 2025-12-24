import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Facebook, Twitter, Linkedin, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

// Hardcoded blog data (should match InsightsSection.tsx)
const blogPosts = [
    {
        id: "4",
        date: "Dec 24, 2024",
        category: "Investment Guide",
        title: "Why Westlands is the Best Place to Invest in Nairobi",
        excerpt: "Explore why Westlands continues to dominate as Nairobi's premier investment destination with unmatched ROI and growth potential.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop",
        author: "Ivory Crest Investment Team",
        readTime: "8 min read",
        content: `
      <p>Westlands has solidified its position as Nairobi's most sought-after commercial and residential hub, offering exceptional investment opportunities for both local and international investors. This comprehensive guide explores why Westlands remains the top choice for property investment in Kenya's capital city.</p>
      
      <h2>Prime Location and Strategic Connectivity</h2>
      <p>Westlands boasts unparalleled accessibility with proximity to Nairobi's CBD, the international airport, and major highways. The area is home to numerous multinational corporations, embassies, international schools, and premium healthcare facilities, creating a self-sustaining ecosystem that drives consistent demand for both commercial and residential properties.</p>
      
      <h3>Infrastructure Development</h3>
      <p>Recent infrastructure upgrades, including the Nairobi Expressway and improved road networks, have significantly reduced commute times and enhanced the area's appeal. The ongoing development of modern shopping malls, entertainment centers, and business parks continues to attract high-net-worth individuals and corporate tenants.</p>
      
      <h2>Exceptional Rental Yields and Capital Appreciation</h2>
      <p>Westlands consistently delivers impressive rental yields averaging 8-10% annually, among the highest in Nairobi. Property values have appreciated by 12-15% year-on-year over the past decade, making it an attractive option for long-term wealth creation.</p>
      
      <h3>Diverse Investment Opportunities</h3>
      <p>From luxury penthouses and serviced apartments to commercial office spaces and mixed-use developments, Westlands offers a wide range of investment options to suit different budgets and strategies. The growing demand for co-working spaces and short-term rentals has opened new revenue streams for savvy investors.</p>
      
      <h2>Premium Amenities and Lifestyle</h2>
      <p>The area features world-class amenities including Sarit Centre, Westgate Mall, and The Mall Westlands. Residents enjoy access to top-tier restaurants, fitness centers, spas, and entertainment venues. International schools like Braeburn and Brookhouse attract expatriate families, ensuring consistent demand for quality housing.</p>
      
      <h2>Strong Market Fundamentals</h2>
      <p>The concentration of multinational companies and diplomatic missions ensures a stable tenant base with strong purchasing power. Young professionals and entrepreneurs are increasingly choosing Westlands for its vibrant lifestyle and business opportunities, creating a dynamic and sustainable market.</p>
      
      <h3>Security and Governance</h3>
      <p>Westlands benefits from enhanced security measures, well-maintained infrastructure, and progressive urban planning. Gated communities with 24/7 security, modern amenities, and professional property management are the norm, attracting quality tenants willing to pay premium rates.</p>
      
      <h2>Future Growth Potential</h2>
      <p>With planned developments including new commercial towers, residential complexes, and transport infrastructure, Westlands is poised for continued growth. The area's transformation into a smart city hub with sustainable buildings and green spaces promises long-term value appreciation.</p>
      
      <h2>Investment Strategies for Success</h2>
      <p>Successful investors in Westlands focus on properties near major transport corridors, proximity to business districts, and access to amenities. Buy-to-let investments in modern apartments with gym facilities, parking, and backup power systems command premium rents and maintain high occupancy rates.</p>
      
      <p>Whether you're looking for steady rental income or long-term capital gains, Westlands offers a proven track record and promising future. The combination of strategic location, strong fundamentals, and continuous development makes it an investment destination that delivers consistent returns.</p>
    `
    },
    {
        id: "5",
        date: "Dec 24, 2024",
        category: "Market Analysis",
        title: "Why Nairobi is the Next Investment Hub in East Africa",
        excerpt: "Discover how Nairobi is positioning itself as Africa's leading real estate investment destination with unprecedented opportunities.",
        image: "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=1200&auto=format&fit=crop",
        author: "Ivory Crest Investment Team",
        readTime: "10 min read",
        content: `
      <p>Nairobi is rapidly emerging as East Africa's premier investment hub, attracting billions in real estate investment from both regional and international investors. This comprehensive analysis explores the factors positioning Kenya's capital as the continent's next major investment destination.</p>
      
      <h2>Economic Powerhouse of East Africa</h2>
      <p>As Kenya's economic nerve center, Nairobi contributes over 60% of the country's GDP and serves as the regional headquarters for numerous multinational corporations. The city's strategic position as East Africa's financial and commercial hub creates unprecedented demand for quality real estate across all sectors.</p>
      
      <h3>Growing Middle Class and Urbanization</h3>
      <p>Kenya's expanding middle class, projected to reach 50% of the population by 2030, is driving unprecedented demand for quality housing, retail spaces, and commercial properties. Urban migration continues at 4% annually, with Nairobi absorbing the majority of this growth, creating sustained pressure on the real estate market.</p>
      
      <h2>Infrastructure Revolution</h2>
      <p>Massive infrastructure investments totaling over $10 billion are transforming Nairobi's landscape. The Nairobi Expressway has revolutionized connectivity, while the ongoing expansion of the railway network and planned BRT systems promise to unlock new development corridors and investment opportunities.</p>
      
      <h3>Digital Infrastructure</h3>
      <p>As Africa's tech capital, Nairobi's robust digital infrastructure attracts global tech companies and startups. The proliferation of tech hubs, innovation centers, and co-working spaces has created a new asset class with strong growth potential, particularly in neighborhoods like Westlands, Kilimani, and Upper Hill.</p>
      
      <h2>Government Support and Policy Framework</h2>
      <p>Kenya's Vision 2030 and the Big Four Agenda prioritize affordable housing and infrastructure development. The government has introduced favorable policies including tax incentives for developers, streamlined approval processes, and initiatives to attract foreign direct investment in real estate.</p>
      
      <h2>Diverse Investment Opportunities</h2>
      <p>Nairobi offers a unique mix of investment opportunities spanning residential, commercial, retail, hospitality, and mixed-use developments. From luxury penthouses in Upper Hill to affordable housing projects in satellite towns, investors can find options across the risk-return spectrum.</p>
      
      <h3>Commercial Real Estate Boom</h3>
      <p>The demand for Grade A office spaces continues to outstrip supply, with absorption rates exceeding 80% in prime locations. International companies are establishing regional headquarters in Nairobi, driving demand for modern office spaces with smart building features and sustainable designs.</p>
      
      <h2>Attractive Investment Returns</h2>
      <p>Nairobi real estate delivers impressive returns with residential property yields averaging 7-9% and commercial properties ranging from 8-12%. Property values have appreciated by 10-15% annually in prime locations over the past five years, significantly outperforming traditional investment vehicles.</p>
      
      <h3>Retail and Hospitality Sectors</h3>
      <p>The expansion of the middle class has fueled growth in retail and hospitality sectors. Modern shopping malls, boutique hotels, and serviced apartments present lucrative investment opportunities, particularly in high-traffic areas with growing populations.</p>
      
      <h2>Regional Gateway and Connectivity</h2>
      <p>Jomo Kenyatta International Airport serves as East Africa's busiest hub, connecting Nairobi to over 50 international destinations. This connectivity positions the city as the ideal base for regional businesses and attracts a steady stream of business travelers and tourists, supporting the hospitality and commercial sectors.</p>
      
      <h2>Sustainability and Green Development</h2>
      <p>Nairobi is leading Africa's green building revolution with increasing adoption of LEED and EDGE certifications. Environmentally sustainable developments command premium rents and values, attracting environmentally conscious tenants and investors focused on ESG criteria.</p>
      
      <h2>Emerging Satellite Towns</h2>
      <p>Areas like Ruiru, Kiambu, Rongai, and Ngong are experiencing rapid development, offering affordable entry points for investors. These satellite towns benefit from improved infrastructure and proximity to Nairobi while offering higher rental yields and strong appreciation potential.</p>
      
      <h2>Tourism and MICE Industry</h2>
      <p>As a gateway to world-renowned safari destinations and East African attractions, Nairobi's tourism industry continues to grow. The expanding Meetings, Incentives, Conferences, and Exhibitions (MICE) sector creates consistent demand for hotel accommodations and conference facilities.</p>
      
      <h2>Investment Risks and Mitigation</h2>
      <p>While opportunities abound, investors should be aware of market risks including oversupply in certain segments, regulatory changes, and economic fluctuations. Due diligence, partnering with reputable developers, and focusing on prime locations with strong fundamentals are key to successful investment.</p>
      
      <h2>Future Outlook</h2>
      <p>With Kenya's economy projected to grow at 5-6% annually, ongoing infrastructure development, and increasing integration into global markets, Nairobi's real estate sector is poised for sustained growth. The city's transformation into a modern, connected metropolis presents a once-in-a-generation investment opportunity.</p>
      
      <p>For investors seeking emerging market exposure with strong fundamentals, transparent governance, and diverse opportunities, Nairobi stands out as East Africa's most compelling real estate investment destination. The combination of economic growth, demographic trends, and strategic development positions the city for decades of prosperity.</p>
    `
    },
    {
        id: "1",
        date: "Oct 24, 2024",
        category: "Market Trends",
        title: "The Future of Luxury Real Estate in Nairobi",
        excerpt: "Discover emerging trends and investment opportunities in Nairobi's prime residential areas.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
        author: "Ivory Crest Team",
        readTime: "5 min read",
        content: `
      <p>The luxury real estate market in Nairobi is experiencing unprecedented growth, driven by a combination of economic stability, urban development, and an increasing number of high-net-worth individuals seeking premium properties.</p>
      
      <h2>Emerging Neighborhoods</h2>
      <p>Areas like Westlands, Kilimani, and Karen continue to dominate the luxury market, offering world-class amenities and strategic locations. These neighborhoods are seeing significant infrastructure development, making them even more attractive to investors.</p>
      
      <h2>Investment Opportunities</h2>
      <p>The demand for luxury apartments and penthouses is at an all-time high. Developers are responding with innovative designs that cater to the modern buyer's need for both comfort and sophistication.</p>
      
      <h2>Future Outlook</h2>
      <p>Experts predict that Nairobi's luxury real estate market will continue its upward trajectory, with rental yields averaging between 6-8% annually. This makes it an attractive option for both local and international investors.</p>
      
      <p>Prime properties in gated communities with 24/7 security, swimming pools, gyms, and proximity to international schools are commanding premium prices and showing strong appreciation potential.</p>
    `
    },
    {
        id: "2",
        date: "Oct 20, 2024",
        category: "Interior Design",
        title: "Minimalist Interiors: A Guide for 2025",
        excerpt: "How to achieve the perfect balance of simplicity and luxury in your modern home.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop",
        author: "Ivory Crest Team",
        readTime: "4 min read",
        content: `
      <p>Minimalism in interior design is not just about reducing clutter—it's about creating spaces that breathe, inspire, and elevate your living experience while maintaining luxury and comfort.</p>
      
      <h2>Key Principles</h2>
      <p>The foundation of minimalist design lies in choosing quality over quantity. Each piece of furniture and decor should serve a purpose while contributing to the overall aesthetic harmony of the space.</p>
      
      <h2>Color Palettes</h2>
      <p>Neutral tones like whites, beiges, and greys form the backbone of minimalist interiors. These colors create a calming atmosphere and allow architectural features to take center stage.</p>
      
      <h2>Smart Storage Solutions</h2>
      <p>Integrated storage solutions help maintain the clean lines characteristic of minimalist design. Hidden cabinets, built-in shelving, and multi-functional furniture pieces are essential.</p>
      
      <p>Natural light plays a crucial role in minimalist spaces. Large windows, skylights, and open floor plans maximize daylight while creating an airy, spacious feel.</p>
    `
    },
    {
        id: "3",
        date: "Oct 15, 2024",
        category: "Investment",
        title: "Why Kilimani is the Hotspot for Investors",
        excerpt: "An in-depth analysis of rental yields and capital appreciation in one of Nairobi's fastest growing suburbs.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop",
        author: "Ivory Crest Team",
        readTime: "6 min read",
        content: `
      <p>Kilimani has emerged as one of Nairobi's most sought-after residential areas, offering exceptional investment opportunities with strong rental yields and impressive capital appreciation rates.</p>
      
      <h2>Strategic Location</h2>
      <p>Located just minutes from the CBD, Kilimani provides easy access to major business districts, shopping centers, and entertainment venues. This prime positioning makes it ideal for professionals and young families.</p>
      
      <h2>Rental Yield Analysis</h2>
      <p>Current market data shows rental yields in Kilimani averaging between 7-9%, significantly higher than many other Nairobi neighborhoods. This makes it particularly attractive for buy-to-let investors.</p>
      
      <h2>Infrastructure Development</h2>
      <p>Ongoing infrastructure improvements, including road networks and utility upgrades, continue to enhance the area's appeal. New commercial developments are also adding to the neighborhood's vibrancy.</p>
      
      <h2>Market Trends</h2>
      <p>Property values in Kilimani have shown consistent appreciation of 8-12% annually over the past five years. With continued demand from both renters and buyers, this trend is expected to continue.</p>
      
      <p>The area's diverse mix of apartments, maisonettes, and standalone houses caters to various buyer preferences and budgets, ensuring sustained market activity.</p>
    `
    }
];

const BlogDetail = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Blog Post Not Found</h1>
                    <Link to="/insights" className="text-primary hover:underline mt-4 inline-block">
                        Return to Insights
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{post.title} - Ivory Crest</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <div className="min-h-screen">
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
                                {post.readTime}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
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
                        <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none
                prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Share Section */}
                        <div className="mt-16 pt-8 border-t border-border">
                            <h3 className="font-display text-xl font-semibold mb-4">Share this article</h3>
                            <div className="flex gap-4">
                                <Button variant="outline" size="icon" asChild>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* Related Posts CTA */}
                        <div className="mt-16 p-8 bg-muted/50 rounded-2xl text-center">
                            <h3 className="font-display text-2xl font-bold mb-4">
                                Explore More Insights
                            </h3>
                            <p className="text-muted-foreground mb-6">
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
        </>
    );
};

export default BlogDetail;
