import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Collaboration() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-brand-blue/30 w-fit">
              <Zap className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-black tracking-widest text-brand-blue uppercase">TEAM SYNERGY</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1]">
              Collaboration <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-glow">Perfected.</span>
            </h2>
            
            <p className="text-xl text-foreground/50 font-medium leading-relaxed max-w-xl">
              Unify your team around intelligent insights. Automatically tag owners, sync with top-tier project tools, and eliminate follow-up friction.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {[
                { title: "Auto-Tagging", text: "AI maps owners to tasks via semantic transcript analysis." },
                { title: "Deep Sync", text: "Direct integrations with Linear, Jira, and Asana boards." },
                { title: "Smart Digest", text: "Executive-level summaries delivered to your inbox daily." },
                { title: "Zero Friction", text: "Automated follow-ups before deadlines even approach." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg text-foreground">{item.title}</h4>
                  <p className="text-sm text-foreground/40 font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            <motion.button 
              whileHover={{ x: 10 }}
              className="mt-6 flex items-center gap-4 text-brand-blue font-black text-lg group"
            >
              EXPLORE INTEGRATIONS <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Immersive UI Mockup */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 to-cyan-glow/30 rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-[3.5rem] border border-foreground/10 p-10 relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] backdrop-blur-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-foreground/5 pb-8 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1rem] bg-brand-blue/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-foreground">TEAM WORKSPACE</h3>
                    <p className="text-xs font-black text-foreground/30 tracking-widest uppercase">SYDNEY • LONDON • NY</p>
                  </div>
                </div>
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-background bg-gradient-to-br from-brand-blue to-cyan-glow shadow-xl z-${40-i*10}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Advanced Task Notification */}
                <motion.div 
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex gap-6 p-6 rounded-[2rem] bg-foreground/[0.02] border border-foreground/5 transition-all cursor-pointer group/item"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-black text-lg shadow-xl">
                    JD
                  </div>
                  <div>
                    <p className="text-lg font-bold group-hover/item:text-brand-blue transition-colors">Jane Doe assigned a task</p>
                    <p className="text-sm text-foreground/50 font-medium mt-1">"Please review the architectural blueprints before EOD."</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-[10px] font-black bg-brand-blue/10 text-brand-blue px-3 py-1.5 rounded-lg tracking-widest uppercase">Blueprint Sync</span>
                    </div>
                  </div>
                </motion.div>

                {/* AI Automated Insight Card */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-6 p-6 rounded-[2rem] bg-brand-blue/[0.04] border border-brand-blue/20 shadow-xl shadow-brand-blue/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-foreground/10 flex-shrink-0 flex items-center justify-center shadow-inner">
                    <Zap className="w-8 h-8 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-brand-blue">AI Automated Follow-up</p>
                    <p className="text-sm text-foreground/70 font-medium mt-1">Reminder sent to Mike K. regarding the API schema update. Due in 4 hours.</p>
                  </div>
                </motion.div>

                {/* Collaboration Progress Card */}
                <div className="p-6 rounded-[2rem] bg-foreground/[0.02] border border-foreground/5">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-black text-foreground uppercase tracking-widest">Global Completion</span>
                    <span className="text-2xl font-black text-brand-blue">84%</span>
                  </div>
                  <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "84%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-brand-blue to-cyan-glow"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Security Badge */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 glass px-8 py-5 rounded-[2rem] border border-emerald-500/30 flex items-center gap-4 shadow-2xl z-30"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-black text-foreground/40 uppercase tracking-widest leading-none mb-1">DATA SECURITY</p>
                <p className="text-sm font-black text-emerald-500 uppercase leading-none">ENTERPRISE GRADE</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
