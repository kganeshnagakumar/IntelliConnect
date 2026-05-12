import { motion } from "framer-motion";
import { Mic, Globe2, Sparkles, HeartPulse, Unplug } from "lucide-react";

const enhancements = [
  {
    icon: Mic,
    title: "Real-time Transcripts",
    description: "Live, word-for-word accuracy with instant speaker diarization.",
    status: "v2.1"
  },
  {
    icon: Unplug,
    title: "Native Connect",
    description: "Deep, zero-latency integration for all major video platforms.",
    status: "v2.2"
  },
  {
    icon: HeartPulse,
    title: "Sentiment Mapping",
    description: "Understand the emotional pulse of your meetings with AI.",
    status: "v2.5"
  },
  {
    icon: Globe2,
    title: "Global Translation",
    description: "Live, real-time audio translation across 120+ dialects.",
    status: "v3.0"
  },
];

export default function FutureEnhancements() {
  return (
    <section className="py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-28">
          <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-8">
            <Sparkles className="w-6 h-6 text-brand-blue" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
            The Roadmap to <br />
            <span className="text-foreground/30">Intelligence.</span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/50 font-medium leading-relaxed">
            We're building the future of work. Explore our upcoming releases as we push the boundaries of meeting intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {enhancements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="glass-card p-10 rounded-[3rem] border border-foreground/5 group flex flex-col items-center text-center transition-all duration-500 shadow-sm"
            >
              <div className="relative mb-10">
                <div className="w-20 h-20 rounded-[1.5rem] bg-foreground/[0.02] border border-foreground/5 flex items-center justify-center group-hover:scale-110 group-hover:border-brand-blue/30 transition-all duration-500">
                  <item.icon className="w-10 h-10 text-brand-blue opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-brand-blue text-[10px] font-black text-white rounded-full tracking-widest">
                  {item.status}
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-brand-blue transition-colors">{item.title}</h3>
              <p className="text-base text-foreground/50 font-medium leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
