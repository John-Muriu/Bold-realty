import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, FileText, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<any>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/admin/login");
            } else {
                setUser(session.user);
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
        <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
            {/* Sidebar */}
            <aside
                className={`bg-[#0b0f19] text-white fixed lg:static h-screen z-40 transition-all duration-300 ${
                    isSidebarOpen ? "w-64" : "w-0 lg:w-20"
                } overflow-hidden border-r border-slate-800 flex flex-col`}
            >
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-850 flex items-center justify-between min-h-[80px]">
                    {isSidebarOpen ? (
                        <div className="flex flex-col">
                            <span className="text-gradient-gold font-display font-extrabold tracking-wider text-xl uppercase">
                                Bold Realty
                            </span>
                            <span className="text-[9px] text-slate-400 tracking-widest uppercase font-semibold block mt-0.5">
                                Admin Portal
                            </span>
                        </div>
                    ) : (
                        <span className="text-gradient-gold font-display font-black text-2xl text-center w-full block">
                            BR
                        </span>
                    )}
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = 
                            location.pathname === item.path || 
                            (item.path !== "/admin" && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                                    isActive
                                        ? "bg-gradient-to-r from-amber-500/10 to-transparent text-amber-500 border-l-4 border-amber-500 pl-3 font-semibold"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 pl-4"
                                }`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-amber-500" : "text-slate-400 group-hover:text-slate-200"}`} />
                                <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap text-sm`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Session Profile & Logout */}
                <div className="p-4 border-t border-slate-850 bg-slate-950/30 space-y-4">
                    {user && (
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 border border-amber-500/30 flex items-center justify-center font-bold text-white shadow-gold shrink-0">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className={`min-w-0 ${!isSidebarOpen && "hidden"}`}>
                                <p className="text-sm font-semibold text-slate-200 truncate">Administrator</p>
                                <p className="text-[11px] text-slate-450 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-450 hover:bg-red-550/10 hover:text-red-400 w-full transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 shrink-0 text-slate-450 hover:text-red-400" />
                        <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap text-sm font-medium`}>
                            Logout Portal
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Desktop Topbar / Mobile Header */}
                <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-display font-bold text-slate-700 hidden sm:inline-block">
                            Bold Realty Management Systems
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                            Production Active
                        </span>
                    </div>
                </header>

                {/* Subpage Router View */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
