import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CopilotPanel from "./CopilotPanel";
import DashboardBackground3D from "./DashboardBackground3D";
import { Search, User, Menu, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useTheme } from "../ThemeProvider";
import { supabase, getAuthToken } from "../../lib/supabase";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Auth: fetch user session (runs once on mount, not on every location change)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) syncProfile();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/login", { replace: true });
      } else {
        syncProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const syncProfile = async () => {
    try {
      const token = await getAuthToken();
      // Hit the backend /api/auth/me endpoint to trigger UserProfile creation in DB
      await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to sync profile to backend", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar isFocusMode={!isSidebarOpen} />

      {/* Main Content Area */}
      <main className={cn(
        "flex-grow flex flex-col h-screen overflow-y-auto scrollbar-hide transition-all duration-500",
        !isSidebarOpen ? "ml-0 lg:ml-0" : "lg:ml-[var(--sidebar-width)]",
        !isCopilotOpen ? "mr-0 xl:mr-0" : "xl:mr-[var(--copilot-width)]"
      )}>
        {/* Topbar */}
        <header className="h-24 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 rounded-2xl glass bg-foreground/[0.02] border border-foreground/5 flex items-center justify-center relative group"
              title="Toggle Menu"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-foreground/60 group-hover:text-brand-blue transition-colors" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 text-brand-blue group-hover:text-cyan-glow transition-colors" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' || theme === 'system' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-xl glass bg-foreground/[0.02] border border-foreground/5 flex items-center justify-center relative group"
              title="Toggle Theme"
            >
              {theme === 'dark' || theme === 'system' ? (
                <Sun className="w-4 h-4 text-foreground/40 group-hover:text-brand-blue transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-foreground/40 group-hover:text-brand-blue transition-colors" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className="w-10 h-10 rounded-xl glass bg-foreground/[0.02] border border-foreground/5 flex items-center justify-center relative group"
              title="Toggle Copilot"
            >
              {isCopilotOpen ? (
                <PanelRightClose className="w-4 h-4 text-foreground/60 group-hover:text-brand-blue transition-colors" />
              ) : (
                <PanelRightOpen className="w-4 h-4 text-brand-blue group-hover:text-cyan-glow transition-colors" />
              )}
            </motion.button>



            <div className="flex items-center gap-4 pl-6 border-l border-foreground/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-foreground max-w-[150px] truncate" title={user?.user_metadata?.full_name || user?.email || "Guest"}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Guest"}
                </p>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-tight">{user?.email ? user.email.split('@')[1] : 'Premium Plan'}</p>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-tighter transition-colors"
                >
                  Logout Session
                </button>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue/20 to-cyan-glow/20 p-[1px] cursor-pointer"
              >
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden border border-foreground/5 relative">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-6 h-6 text-foreground/40" />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-grow p-10 pt-0 relative z-10">
          <Outlet />
        </div>

        {/* Global Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <DashboardBackground3D />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-glow/5 rounded-full blur-[120px]" />
          <div className="noise-bg" />
        </div>
      </main>

      {/* Copilot Panel */}
      <CopilotPanel isFocusMode={!isCopilotOpen} />
    </div>
  );
}
