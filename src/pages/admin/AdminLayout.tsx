import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, FileText, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check auth
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/admin/login");
            }
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    const menuItems = [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Properties", path: "/admin/properties", icon: Building2 },
        { name: "Blogs", path: "/admin/blogs", icon: FileText },
        { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`bg-slate-900 text-white fixed lg:static h-full z-40 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0 lg:w-20"
                    } overflow-hidden`}
            >
                <div className="p-6 flex items-center justify-between">
                    <h1 className={`font-display font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
                        Admin Panel
                    </h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? "bg-primary text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 w-full mt-8"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>
                            Logout
                        </span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                <header className="bg-white border-b p-4 flex items-center gap-4 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold">Ivory Crest Admin</span>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
