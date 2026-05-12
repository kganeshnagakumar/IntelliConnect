import { motion, useScroll, useTransform } from "framer-motion";
import { Maximize2, ExternalLink, Activity, Lock, CheckCircle2, Code } from "lucide-react";
import { useRef, useState } from "react";

export default function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  const [embedInput, setEmbedInput] = useState("");
  const [activeIframeSrc, setActiveIframeSrc] = useState("");

  const handleApply = () => {
    const srcMatch = embedInput.match(/src=["'](.*?)["']/);
    if (srcMatch && srcMatch[1]) {
      setActiveIframeSrc(srcMatch[1]);
    } else if (embedInput.startsWith("http")) {
      setActiveIframeSrc(embedInput);
    } else {
      alert("Please provide a valid Power BI iframe code or URL.");
    }
  };

  return (
    <section ref={containerRef} className="py-40 relative perspective-2000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest mb-6">
            <Activity className="w-3.5 h-3.5" /> Live Data Integration
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground">
            Enterprise Analytics <br />
            <span className="text-foreground/30">Embedded Seamlessly.</span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/50 font-medium">
            Connect your existing Power BI dashboards directly into your meeting intelligence workflow.
          </p>
        </motion.div>

        <motion.div
          style={{ rotateX, scale }}
          className="relative rounded-[3rem] border border-foreground/10 bg-background/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden glass-card group"
        >
          {/* OS-style Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-foreground/5 bg-foreground/[0.02]">
            <div className="flex gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex items-center gap-3 bg-foreground/5 px-6 py-2 rounded-xl text-xs font-bold text-foreground/40 border border-foreground/5">
              <Lock className="w-3 h-3" />
              {activeIframeSrc ? (activeIframeSrc.substring(0, 30) + '...') : 'Waiting for connection...'}
            </div>
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setActiveIframeSrc("")}
                className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/40 text-xs font-bold px-4"
              >
                Disconnect
              </button>
              <button className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/40">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/40">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="relative w-full aspect-video bg-[#050505] flex items-center justify-center overflow-hidden">
            {!activeIframeSrc ? (
              <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl p-10 glass rounded-[2.5rem] border border-foreground/10 text-center shadow-2xl shadow-brand-blue/5">
                <div className="w-20 h-20 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 shadow-inner">
                  <Code className="w-10 h-10 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight text-white dark:text-white">Connect Power BI</h3>
                <p className="text-sm text-foreground/60 font-medium mb-8 leading-relaxed">
                  Paste your Power BI embedded HTML iframe code or direct secure link to instantly integrate live enterprise analytics into this command center.
                </p>
                <div className="w-full flex flex-col gap-4">
                  <textarea
                    value={embedInput}
                    onChange={(e) => setEmbedInput(e.target.value)}
                    placeholder='<iframe src="https://app.powerbi.com/..." />'
                    className="w-full h-32 bg-background/5 border border-foreground/20 rounded-2xl p-4 text-sm font-medium focus:ring-1 focus:ring-brand-blue transition-all resize-none font-mono text-white/80 placeholder:text-white/20"
                  />
                  <button 
                    onClick={handleApply}
                    disabled={!embedInput.trim()}
                    className="w-full py-4 bg-brand-blue text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-neon-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/20"
                  >
                    Initialize Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
                   <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mb-4" />
                   <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest animate-pulse">Establishing Secure Stream...</p>
                </div>
                
                <iframe 
                  title="Power BI Embedded Dashboard" 
                  className="w-full h-full relative z-10 border-none bg-transparent"
                  src={activeIframeSrc} 
                  allowFullScreen={true}
                />

                {/* Holographic scanning effect */}
                <motion.div
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue to-transparent shadow-[0_0_20px_rgba(37,99,235,0.8)] z-30 pointer-events-none opacity-40"
                />
              </>
            )}
          </div>
          
          {/* Dashboard Meta Footer */}
          <div className="px-8 py-4 border-t border-foreground/5 bg-foreground/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-foreground/30">
               {activeIframeSrc ? (
                 <>
                   <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> Real-time Sync Active</span>
                   <span>Last updated: Just now</span>
                 </>
               ) : (
                 <span className="flex items-center gap-1.5">Awaiting Integration</span>
               )}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue">
              Powered by Microsoft Power BI
            </div>
          </div>
        </motion.div>
        
        {/* Glow behind the dashboard */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)] -z-10 blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
