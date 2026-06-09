import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
    Building2,
    FileText,
    MessageSquare,
    DollarSign,
    TrendingUp,
    PlusCircle,
    ArrowRight,
    MapPin,
    Activity,
    Mail,
    Phone,
    Star,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

const COLORS = ["#d97706", "#0f172a", "#f59e0b", "#64748b", "#3b82f6"];

const AdminDashboard = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [blogsCount, setBlogsCount] = useState<number>(0);
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const [totalInquiriesCount, setTotalInquiriesCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    
    const [contactedIds, setContactedIds] = useState<string[]>(() => {
        const saved = localStorage.getItem("contacted_enquiry_ids");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Fetch properties
                const { data: propData } = await supabase
                    .from("properties")
                    .select("*");
                if (propData) setProperties(propData);

                // 2. Fetch blogs count
                const { count: bCount } = await supabase
                    .from("blogs")
                    .select("id", { count: "exact", head: true });
                if (bCount !== null) setBlogsCount(bCount);

                // 3. Fetch inquiries
                const { data: inqData } = await supabase
                    .from("inquiries")
                    .select("*, properties:property_id(title)")
                    .order("created_at", { ascending: false })
                    .limit(4);
                if (inqData) setRecentInquiries(inqData);

                // 4. Fetch total inquiries count
                const { count: inqCount } = await supabase
                    .from("inquiries")
                    .select("id", { count: "exact", head: true });
                if (inqCount !== null) setTotalInquiriesCount(inqCount);

            } catch (err) {
                console.error("Error loading dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const markAsContacted = (id: string) => {
        const updated = [...contactedIds, id];
        setContactedIds(updated);
        localStorage.setItem("contacted_enquiry_ids", JSON.stringify(updated));
    };

    // --- Aggregates ---
    const totalProperties = properties.length;
    const offPlanCount = properties.filter(p => p.status === "off-plan").length;
    const readyCount = properties.filter(p => p.status === "ready").length;

    const buyProperties = properties.filter(p => p.listing_type === "buy");
    const portfolioValue = buyProperties.reduce((sum, p) => sum + (p.price || 0), 0);
    const avgPrice = buyProperties.length > 0 ? portfolioValue / buyProperties.length : 0;

    // --- Charts calculations ---
    const typeCounts: Record<string, number> = {};
    properties.forEach(p => {
        const type = p.property_type || "Apartment";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    const typeData = Object.keys(typeCounts).map(type => ({
        name: type,
        value: typeCounts[type]
    }));

    const locationCounts: Record<string, number> = {};
    properties.forEach(p => {
        const loc = p.location ? p.location.split(",")[0].trim() : "Nairobi";
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
    const locationData = Object.keys(locationCounts).map(loc => ({
        name: loc,
        properties: locationCounts[loc]
    })).sort((a, b) => b.properties - a.properties).slice(0, 5);

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `KES ${(price / 1000000).toFixed(1)}M`;
        }
        return `KES ${price.toLocaleString()}`;
    };

    const newInquiriesCount = recentInquiries.filter(i => !contactedIds.includes(i.id)).length;

    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-10 bg-slate-200 w-1/4 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[350px] bg-slate-200 rounded-xl" />
                    <div className="h-[350px] bg-slate-200 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Banner */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-elevated relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Welcome back to your Bold Realty command center. Manage listings, monitor enquiries, and view metrics.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10">
                    <Button variant="gold" asChild className="btn-gold font-medium">
                        <Link to="/admin/properties/new">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Property
                        </Link>
                    </Button>
                    <Button variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white" asChild>
                        <Link to="/admin/blogs">
                            <FileText className="w-4 h-4 mr-2" />
                            Write Blog
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Total Properties */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-card transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Total Properties</span>
                            <span className="text-3xl font-extrabold text-gray-900 block">{totalProperties}</span>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
                            <Building2 className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                        <span>{readyCount} Ready (Complete)</span>
                        <span className="font-semibold text-amber-600">{offPlanCount} Off-Plan</span>
                    </div>
                </div>

                {/* Card 2: Portfolio Value */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-card transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-900" />
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Portfolio Value</span>
                            <span className="text-3xl font-extrabold text-gray-900 block">{formatPrice(portfolioValue)}</span>
                        </div>
                        <div className="p-3 bg-slate-50 text-slate-800 rounded-lg group-hover:bg-slate-100 transition-colors">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500">
                        Total value of listed Buy properties
                    </div>
                </div>

                {/* Card 3: Avg. Property Price */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-card transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Avg. Listing Price</span>
                            <span className="text-3xl font-extrabold text-gray-900 block">{formatPrice(avgPrice)}</span>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500">
                        Average listing price in Nairobi
                    </div>
                </div>

                {/* Card 4: New Enquiries */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-card transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-900" />
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Total Enquiries</span>
                            <span className="text-3xl font-extrabold text-gray-900 block">{totalInquiriesCount}</span>
                        </div>
                        <div className="p-3 bg-slate-50 text-slate-800 rounded-lg group-hover:bg-slate-100 transition-colors">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                        <span>{newInquiriesCount} new messages</span>
                        <span className="font-semibold text-slate-800">Blogs: {blogsCount}</span>
                    </div>
                </div>
            </div>

            {/* Charts & Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: Properties by Type */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="font-display font-bold text-lg text-gray-900">Properties by Type</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Listing counts classified by structure type</p>
                        </div>
                        <Layers className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-[280px] w-full flex items-center justify-center">
                        {typeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={typeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {typeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: "#0b0f19", border: "none", borderRadius: "8px", color: "#fff" }} />
                                    <Legend formatter={(value) => <span className="text-xs font-semibold text-gray-700">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <span className="text-gray-400 text-sm">No properties to display</span>
                        )}
                    </div>
                </div>

                {/* Chart 2: Top Locations */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="font-display font-bold text-lg text-gray-900">Top Locations</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Most active listing hotspots in Nairobi</p>
                        </div>
                        <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="h-[280px] w-full">
                        {locationData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={locationData}
                                    layout="vertical"
                                    margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={80}
                                    />
                                    <Tooltip contentStyle={{ background: "#0b0f19", border: "none", borderRadius: "8px", color: "#fff" }} />
                                    <Bar
                                        dataKey="properties"
                                        fill="#e2a850"
                                        radius={[0, 4, 4, 0]}
                                        barSize={16}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <span className="text-gray-400 text-sm flex items-center justify-center h-full">No location data to display</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Enquiries & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns (2 cols): Recent Enquiries list */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft lg:col-span-2">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                        <div>
                            <h3 className="font-display font-bold text-lg text-gray-900">Recent Enquiries</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Latest messages from potential buyers</p>
                        </div>
                        <Link to="/admin/enquiries" className="text-xs font-semibold text-primary hover:text-accent flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentInquiries.length === 0 ? (
                            <div className="text-center py-10">
                                <span className="text-gray-400 text-sm">No enquiries found</span>
                            </div>
                        ) : (
                            recentInquiries.map((inquiry) => {
                                const isNew = !contactedIds.includes(inquiry.id);
                                return (
                                    <div key={inquiry.id} className="p-4 rounded-xl border border-gray-50 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row justify-between items-start gap-4 text-sm">
                                        <div className="space-y-2 flex-grow">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-gray-900">{inquiry.name}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${isNew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {isNew ? 'NEW' : 'CONTACTED'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    {inquiry.email}
                                                </span>
                                                {inquiry.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        {inquiry.phone}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 line-clamp-1 italic text-xs">
                                                "{inquiry.message || "No message provided."}"
                                            </p>
                                        </div>
                                        <div className="flex sm:flex-col items-end gap-3 flex-shrink-0 text-right w-full sm:w-auto">
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(inquiry.created_at).toLocaleDateString()}
                                            </span>
                                            {isNew && (
                                                <Button size="xs" variant="outline" onClick={() => markAsContacted(inquiry.id)} className="text-[10px] h-7 px-2">
                                                    Mark Contacted
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: Quick Insights */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft">
                    <div className="mb-6 pb-4 border-b border-gray-50">
                        <h3 className="font-display font-bold text-lg text-gray-900">Quick Insights</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Automated analytics from your current listings</p>
                    </div>

                    <div className="space-y-6">
                        {/* Progress 1: Buy vs Rent */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-gray-700">
                                <span>Properties for Sale</span>
                                <span>{properties.length > 0 ? Math.round((properties.filter(p => p.listing_type === 'buy').length / properties.length) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${properties.length > 0 ? (properties.filter(p => p.listing_type === 'buy').length / properties.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Progress 2: Featured properties */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-gray-700">
                                <span>Featured Listings</span>
                                <span>{properties.length > 0 ? Math.round((properties.filter(p => p.featured).length / properties.length) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-slate-800 h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${properties.length > 0 ? (properties.filter(p => p.featured).length / properties.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Recent properties list widget */}
                        <div className="pt-4 border-t border-gray-50 space-y-3">
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recently Added</h4>
                            <div className="space-y-2.5">
                                {properties.slice(0, 3).map((p) => (
                                    <div key={p.id} className="flex gap-3 items-center text-xs">
                                        <img src={p.image_url || "/placeholder.png"} alt={p.title} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                                        <div className="min-w-0 flex-grow">
                                            <h5 className="font-semibold text-gray-900 line-clamp-1">{p.title}</h5>
                                            <span className="text-[10px] text-gray-400">{p.location}</span>
                                        </div>
                                        <span className="font-bold text-amber-600 flex-shrink-0">
                                            {formatPrice(p.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
