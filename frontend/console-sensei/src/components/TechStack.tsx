import { motion } from "framer-motion";
import { Code2, Database, Brain, Cpu, Fingerprint } from "lucide-react";

const technologies = [
  {
    category: "FRONTEND",
    icon: Code2,
    items: ["React 19", "Three.js", "Tailwind 4.0", "Framer Motion"],
    color: "from-blue-600 to-cyan-500"
  },
  {
    category: "CORE ENGINE",
    icon: Cpu,
    items: ["Python 3.12", "Django Ninja", "Rust Extensions", "Go Services"],
    color: "from-indigo-600 to-blue-500"
  },
  {
    category: "AI ARCHITECTURE",
    icon: Brain,
    items: ["GPT-4o API", "Llama 3 Local", "Custom NLP", "Vector DB"],
    color: "from-purple-600 to-blue-400"
  },
  {
    category: "DATA INFRA",
    icon: Database,
    items: ["Supabase", "Redis Cache", "PostgreSQL", "S3 Storage"],
    color: "from-cyan-600 to-emerald-500"
  },
];

export default function TechStack() {
  return (
    <section className="py-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-28 gap-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
              Engineered for <br />
              <span className="text-foreground/30">The Future.</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/50 font-medium">
              We leverage the world's most powerful technologies to deliver an unparalleled intelligence experience.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-foreground/5 px-8 py-4 rounded-2xl border border-foreground/5">
            <Fingerprint className="w-8 h-8 text-brand-blue" />
            <span className="text-sm font-black text-foreground uppercase tracking-widest">Enterprise Validated</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-10 rounded-[3rem] border border-foreground/5 group relative overflow-hidden transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 bg-gradient-to-br ${tech.color} shadow-2xl group-hover:scale-110 transition-transform`}>
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-black mb-6 tracking-widest text-foreground/40 group-hover:text-foreground transition-colors uppercase">{tech.category}</h3>
                <ul className="space-y-4">
                  {tech.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base text-foreground/60 font-bold">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${tech.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
