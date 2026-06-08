import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
    const [propertiesCount, setPropertiesCount] = useState<number | null>(null);
    const [blogsCount, setBlogsCount] = useState<number | null>(null);
    const [enquiriesCount, setEnquiriesCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [propRes, blogRes, inqRes] = await Promise.all([
                    supabase.from("properties").select("id"),
                    supabase.from("blogs").select("id"),
                    supabase.from("inquiries").select("id")
                ]);

                if (!propRes.error && propRes.data) {
                    setPropertiesCount(propRes.data.length);
                }
                if (!blogRes.error && blogRes.data) {
                    setBlogsCount(blogRes.data.length);
                }
                if (!inqRes.error && inqRes.data) {
                    setEnquiriesCount(inqRes.data.length);
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading || propertiesCount === null ? "..." : propertiesCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Blog Posts</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading || blogsCount === null ? "..." : blogsCount}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">New Enquiries</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loading || enquiriesCount === null ? "..." : enquiriesCount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
