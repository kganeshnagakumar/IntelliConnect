import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BrainCircuit,
  Shield,
  Target,
  Users,
  Zap,
  LineChart,
  Sparkles,
  TrendingUp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  metric: string;
  label: string;
}

const features: Feature[] = [
  {
    icon: BrainCircuit,
    title: "AI Neural Engine",
    description: "Proprietary LLMs trained specifically for meeting context and complex team dynamics.",
    metric: "99.8%",
    label: "Accuracy"
  },
  {
    icon: Target,
    title: "Instant Action Items",
    description: "Auto-extraction of tasks with assigned owners and deadlines in sub-second time.",
    metric: "< 2s",
    label: "Latency"
  },
  {
    icon: Shield,
    title: "Enterprise Governance",
    description: "SOC2 Type II compliant infrastructure with end-to-end holographic encryption.",
    metric: "256-bit",
    label: "Security"
  },
  {
    icon: Zap,
    title: "Cross-Team Sync",
    description: "Seamlessly push extracted insights to Slack, Notion, Jira, and Linear.",
    metric: "50+",
    label: "Integrations"
  },
  {
    icon: Users,
    title: "Team Intelligence",
    description: "Synchronize tasks and share insights across your global workspace effortlessly.",
    metric: "10x",
    label: "Efficiency"
  },
  {
    icon: LineChart,
    title: "Visual Analytics",
    description: "Beautifully visualize team productivity and ROI with custom dashboard metrics.",
    metric: "Real-time",
    label: "Updates"
  }
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative glass-card p-10 rounded-[2.5rem] border border-foreground/5 hover:border-brand-blue/30 transition-all duration-500 h-full flex flex-col"
    >
      {/* Glossy Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />
      
      {/* 3D Content Layers */}
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex flex-col h-full">
        <div className="w-16 h-16 rounded-[1.25rem] bg-brand-blue/10 flex items-center justify-center mb-10 group-hover:bg-brand-blue/20 transition-all duration-500 group-hover:scale-110 shadow-inner">
          <feature.icon className="w-8 h-8 text-brand-blue" />
        </div>
        
        <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-brand-blue transition-colors duration-300">
          {feature.title}
        </h3>
        
        <p className="text-foreground/50 text-base leading-relaxed font-medium mb-10 flex-grow">
          {feature.description}
        </p>

        {/* Metric Badge */}
        <div className="pt-6 border-t border-foreground/5 flex items-center justify-between mt-auto">
          <div>
            <p className="text-2xl font-black text-foreground">{feature.metric}</p>
            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">{feature.label}</p>
          </div>
          <div className="p-2 rounded-lg bg-foreground/5 text-foreground/20 group-hover:text-brand-blue transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subtle Glow Background */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-blue/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}

export default function FeatureCards() {
  return (
    <section id="features" className="py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-28"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" /> Core Capabilities
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground">
            Powering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-glow">
              Next Era of Work.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/50 font-medium">
            Next-gen intelligence that auto-extracts value from every conversation with pixel-perfect precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
