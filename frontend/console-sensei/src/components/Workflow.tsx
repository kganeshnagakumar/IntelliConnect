import { motion } from "framer-motion";
import { Upload, Brain, ListChecks, LayoutDashboard, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: Upload,
    title: "Import",
    description: "Upload transcripts or connect live to Zoom, Teams, or Meet.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: Brain,
    title: "Process",
    description: "Our proprietary NLP engine maps context, sentiment, and intent.",
    color: "from-purple-500 to-blue-400"
  },
  {
    icon: ListChecks,
    title: "Extract",
    description: "Tasks, owners, and deadlines are automatically structured.",
    color: "from-cyan-500 to-emerald-400"
  },
  {
    icon: LayoutDashboard,
    title: "Execute",
    description: "Actionable dashboards generated for immediate team execution.",
    color: "from-blue-600 to-indigo-500"
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      <div className="glass-card p-10 rounded-[3rem] border border-foreground/5 hover:border-brand-blue/30 transition-all duration-500 flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${step.color} p-[1px] mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
          <div className="w-full h-full rounded-[1.5rem] bg-background flex items-center justify-center">
            <step.icon className="w-10 h-10 text-brand-blue" />
          </div>
        </div>
        
        <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-brand-blue transition-colors">{step.title}</h3>
        <p className="text-foreground/50 text-base leading-relaxed font-medium">{step.description}</p>
        
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-brand-blue/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10" />
      </div>
      
      {/* Connector Arrow (Desktop) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 z-20 text-foreground/10 group-hover:text-brand-blue/30 transition-colors">
          <ArrowRight className="w-10 h-10" />
        </div>
      )}
    </motion.div>
  );
}

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} id="workflow" className="py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-28"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground">
            Precision <br />
            <span className="text-foreground/30">In Every Step.</span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/50 font-medium">
            Four seamless phases that transform raw audio into high-fidelity operational data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {/* Animated Connection Path (Background) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-foreground/5 -translate-y-1/2" />
          
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
