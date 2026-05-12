import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Code2, ExternalLink, Trash2, RefreshCw, ChevronDown, ChevronUp, ChevronsLeftRight } from "lucide-react";

const PLACEHOLDER = `<iframe title="Task Board" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=..." frameborder="0" allowFullScreen="true"></iframe>`;

const LS_SRC = "pbi_tasks_active_src";
const LS_CODE = "pbi_tasks_iframe_code";

export default function Tasks() {
  const [iframeCode, setIframeCode] = useState<string>(
    () => localStorage.getItem(LS_CODE) ?? ""
  );
  const [activeIframe, setActiveIframe] = useState<string>(
    () => localStorage.getItem(LS_SRC) ?? ""
  );
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState<boolean>(
    () => !localStorage.getItem(LS_SRC)
  );
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem(LS_CODE, iframeCode);
  }, [iframeCode]);

  useEffect(() => {
    if (activeIframe) {
      localStorage.setItem(LS_SRC, activeIframe);
    } else {
      localStorage.removeItem(LS_SRC);
    }
  }, [activeIframe]);

  const extractSrc = (html: string): string | null => {
    const match = html.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  };

  const handleEmbed = () => {
    setError("");
    const trimmed = iframeCode.trim();
    if (!trimmed) {
      setError("Please paste an iframe embed code first.");
      return;
    }
    const src = trimmed.startsWith("<") ? extractSrc(trimmed) : trimmed;
    if (!src) {
      setError("Could not find a valid src URL in your iframe code. Make sure it's a proper <iframe> tag.");
      return;
    }
    setIsLoading(true);
    setActiveIframe(src);
    setPanelOpen(false);
  };

  const handleClear = () => {
    setIframeCode("");
    setActiveIframe("");
    localStorage.removeItem(LS_SRC);
    localStorage.removeItem(LS_CODE);
    setError("");
    setPanelOpen(true);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-8rem)]">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-blue">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Task Board</h1>
            <p className="text-foreground/40 text-sm font-medium">Manage and track AI-extracted action items.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeIframe && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPanelOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 font-bold text-sm transition-all"
            >
              <Code2 className="w-4 h-4" />
              {panelOpen ? "Hide" : "Edit Embed"}
              {panelOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </motion.button>
          )}
          {activeIframe && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Embed Input Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="embed-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-[2rem] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-blue" />
                <span className="font-black text-sm uppercase tracking-widest text-foreground/50">
                  Paste your Power BI iframe embed code
                </span>
              </div>

              <textarea
                ref={textareaRef}
                value={iframeCode}
                onChange={(e) => { setIframeCode(e.target.value); setError(""); }}
                placeholder={PLACEHOLDER}
                rows={4}
                className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-2xl px-5 py-4 font-mono text-sm text-foreground/80 placeholder:text-foreground/20 resize-none outline-none focus:border-brand-blue/40 focus:bg-brand-blue/[0.02] transition-all"
                style={{ lineHeight: "1.7" }}
              />

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs font-bold"
                  >
                    ⚠ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEmbed}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-blue/20 hover:bg-neon-blue transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Embed Dashboard
                </motion.button>

                {iframeCode && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIframeCode("")}
                    className="px-4 py-3 rounded-2xl border border-foreground/10 text-foreground/40 hover:text-foreground/70 text-sm font-bold transition-all"
                  >
                    Reset
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Iframe Viewer */}
      <AnimatePresence>
        {activeIframe ? (
          <motion.div
            key="iframe-viewer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-[2rem] overflow-hidden flex-1 relative"
            style={{ minHeight: "560px" }}
          >
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Loading dashboard…</p>
                </motion.div>
              )}
            </AnimatePresence>

            <iframe
              key={activeIframe}
              src={activeIframe}
              title="Task Board"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0"
              style={{ minHeight: "560px" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-[2rem] flex-1 flex flex-col items-center justify-center gap-5 py-24 border-2 border-dashed border-foreground/[0.06]"
          >
            <div className="w-20 h-20 rounded-3xl bg-brand-blue/10 flex items-center justify-center">
              <ListTodo className="w-9 h-9 text-brand-blue/50" />
            </div>
            <div className="text-center">
              <p className="font-black text-lg text-foreground/30">No task board embedded yet</p>
              <p className="text-sm text-foreground/20 mt-1">Paste your Power BI iframe code above and click <strong>Embed Dashboard</strong></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
