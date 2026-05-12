import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Paperclip,
  Mic,
  PlusCircle
} from "lucide-react";
import { cn } from "../../lib/utils";
import axios from "axios";
import { supabase, getAuthToken } from "../../lib/supabase";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const suggestedPrompts = [
  "Summarize last meeting",
  "Show action items",
  "Team performance overview",
  "Risk analysis for Q3"
];

export default function CopilotPanel({ isFocusMode = false }: { isFocusMode?: boolean }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Copilot. How can I help you with your meetings and tasks today?",
      time: '12:00 PM',
      suggestions: [] as string[]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), suggestions: [] as string[] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const token = await getAuthToken();
      const response = await axios.post(`${API_BASE}/api/ai/copilot/`, 
        { message: text, include_context: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.follow_up_suggestions || []
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check the backend is running.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={cn(
      "w-[var(--copilot-width)] h-screen fixed right-0 top-0 p-6 z-40 hidden xl:block transition-transform duration-500",
      isFocusMode ? "translate-x-full" : "translate-x-0"
    )}>
      <div className="w-full h-full glass-card rounded-[2.5rem] flex flex-col overflow-hidden relative border-l border-brand-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-cyan-glow flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight text-foreground">AI COPILOT</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Active Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                  msg.role === 'user'
                    ? "bg-brand-blue text-white rounded-tr-none"
                    : "glass bg-foreground/[0.03] text-foreground/80 rounded-tl-none border border-foreground/5"
                )}>
                  {msg.content}
                </div>
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map((s, si) => (
                      <button
                        key={si}
                        onClick={() => handleSend(s)}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[10px] font-bold text-foreground/30 mt-2 uppercase tracking-tighter">
                  {msg.time}
                </span>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 glass bg-foreground/[0.03] rounded-2xl rounded-tl-none border border-foreground/5 w-16"
              >
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" />
              </motion.div>
            )}
            <div ref={bottomRef} />
          </AnimatePresence>
        </div>

        {/* Contextual Recommendations Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-4 p-4 glass bg-brand-blue/5 border border-brand-blue/20 rounded-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Smart Insights
          </p>
          <p className="text-xs font-medium text-foreground/70 leading-relaxed">
            I noticed your "Q3 Roadmap" task is overdue. Should I draft an update for Alex?
          </p>
        </motion.div>

        {/* Suggestions & Input */}
        <div className="p-6 mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="text-[10px] font-bold px-3 py-2 rounded-lg bg-foreground/5 hover:bg-brand-blue/10 hover:text-brand-blue transition-all border border-foreground/5 text-foreground/50 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-brand-blue/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative glass bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-2 flex flex-col gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Ask your Copilot anything..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-3 resize-none min-h-[80px] text-foreground placeholder:text-foreground/20"
              />
              <div className="flex items-center justify-end px-2 pb-1">
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    "p-2.5 rounded-xl transition-all shadow-lg shadow-brand-blue/20",
                    input.trim() && !isTyping ? "bg-brand-blue text-white" : "bg-foreground/5 text-foreground/20"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-glow/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  );
}
