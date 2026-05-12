import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Monitor,
  Database,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";
import { cn } from "../../lib/utils";

const CONNECTIONS = [
  { id: 'overview', name: 'Overview Dashboard', keySrc: 'pbi_active_src', keyCode: 'pbi_iframe_code' },
  { id: 'team', name: 'Team Analytics', keySrc: 'pbi_team_active_src', keyCode: 'pbi_team_iframe_code' },
  { id: 'tasks', name: 'Task Board', keySrc: 'pbi_tasks_active_src', keyCode: 'pbi_tasks_iframe_code' },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  
  // State for data connections
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    // Load initial connection codes
    const initialConnections: Record<string, string> = {};
    CONNECTIONS.forEach(conn => {
      initialConnections[conn.id] = localStorage.getItem(conn.keyCode) || "";
    });
    setConnections(initialConnections);
  }, []);

  const handleConnectionChange = (id: string, value: string) => {
    setConnections(prev => ({ ...prev, [id]: value }));
    setSaveStatus(null);
  };

  const extractSrc = (html: string): string | null => {
    const match = html.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  };

  const saveConnections = () => {
    let hasError = false;

    CONNECTIONS.forEach(conn => {
      const code = connections[conn.id]?.trim() || "";
      localStorage.setItem(conn.keyCode, code);
      
      if (code) {
        const src = code.startsWith("<") ? extractSrc(code) : code;
        if (src) {
          localStorage.setItem(conn.keySrc, src);
        } else {
          hasError = true;
        }
      } else {
        localStorage.removeItem(conn.keySrc);
      }
    });

    if (hasError) {
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-blue/10 text-brand-blue">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Settings</h1>
            <p className="text-foreground/50 font-medium">Manage your preferences and dynamic data connections.</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Appearance Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-8 col-span-1 h-fit"
        >
          <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
            <Sun className="w-5 h-5 text-brand-blue" /> Appearance
          </h2>
          
          <div className="space-y-4">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Theme', icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  theme === t.id 
                    ? "border-brand-blue bg-brand-blue/5" 
                    : "border-foreground/5 hover:border-brand-blue/30 bg-foreground/[0.02]"
                )}
              >
                <div className="flex items-center gap-3">
                  <t.icon className={cn("w-5 h-5", theme === t.id ? "text-brand-blue" : "text-foreground/40")} />
                  <span className={cn("font-bold", theme === t.id ? "text-brand-blue" : "text-foreground/70")}>{t.label}</span>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  theme === t.id ? "border-brand-blue" : "border-foreground/20"
                )}>
                  {theme === t.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Data Connections Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2.5rem] p-8 col-span-1 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-glow" /> Data Connections
            </h2>
            <div className="flex items-center gap-3">
              {saveStatus === 'success' && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                  <AlertCircle className="w-4 h-4" /> Invalid Code
                </span>
              )}
              <button 
                onClick={saveConnections}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-neon-blue transition-all"
              >
                Save Connections
              </button>
            </div>
          </div>

          <p className="text-sm font-medium text-foreground/50 mb-8">
            Manage your Power BI iframe embed codes for the dynamic dashboards. Leave blank to show the empty state.
          </p>

          <div className="space-y-6">
            {CONNECTIONS.map((conn) => (
              <div key={conn.id} className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex justify-between">
                  {conn.name}
                  {connections[conn.id] && <span className="text-brand-blue">Active</span>}
                </label>
                <textarea
                  value={connections[conn.id] || ""}
                  onChange={(e) => handleConnectionChange(conn.id, e.target.value)}
                  placeholder={`<iframe title="${conn.name}" ...></iframe>`}
                  rows={3}
                  className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-2xl px-5 py-4 font-mono text-sm text-foreground/80 placeholder:text-foreground/20 resize-none outline-none focus:border-brand-blue/40 focus:bg-brand-blue/[0.02] transition-all"
                />
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
