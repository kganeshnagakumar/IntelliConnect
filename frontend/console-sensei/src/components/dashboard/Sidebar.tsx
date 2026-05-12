import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Video, 
  CheckSquare, 
  Users, 
  FileText, 
  Settings,
  CloudLightning
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Video, label: "Meetings", href: "/dashboard/meetings" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
  { icon: Users, label: "Participants", href: "/dashboard/participants" },

];

export default function Sidebar({ isFocusMode = false }: { isFocusMode?: boolean }) {
  const location = useLocation();

  return (
    <div className={cn(
      "w-[var(--sidebar-width)] h-screen fixed left-0 top-0 p-6 z-40 hidden lg:block transition-transform duration-500",
      isFocusMode ? "-translate-x-full" : "translate-x-0"
    )}>
      <div className="w-full h-full glass-card rounded-[2.5rem] flex flex-col p-6 overflow-hidden relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-12 group px-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-cyan-glow p-[1.5px] shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform duration-500">
            <CloudLightning className="relative z-10 w-5 h-5 text-foreground" />
          </div>
          <span className="font-black text-xl tracking-tighter">
            IntelliConnect
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "text-white" 
                    : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-brand-blue rounded-2xl shadow-lg shadow-brand-blue/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-white" : "text-foreground/40"
                )} />
                <span className="font-bold text-sm relative z-10">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute -right-2 w-1.5 h-6 bg-cyan-glow rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="pt-6 border-t border-foreground/5 mt-auto">
          <Link to="/dashboard/settings" className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all w-full group relative",
            location.pathname === "/dashboard/settings"
              ? "text-white" 
              : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
          )}>
            {location.pathname === "/dashboard/settings" && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 bg-brand-blue rounded-2xl shadow-lg shadow-brand-blue/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Settings className={cn(
              "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-90",
              location.pathname === "/dashboard/settings" ? "text-white" : "text-foreground/40"
            )} />
            <span className="font-bold text-sm relative z-10">Settings</span>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none" />
      </div>
    </div>
  );
}
