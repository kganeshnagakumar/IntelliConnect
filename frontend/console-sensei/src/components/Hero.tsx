import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, MeshTransmissionMaterial } from "@react-three/drei";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Play, ArrowRight, Command } from "lucide-react";
import * as THREE from "three";

function HolographicCube() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
      
      const targetX = (state.mouse.x * Math.PI) / 6;
      const targetY = (state.mouse.y * Math.PI) / 6;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <boxGeometry args={[3.2, 3.2, 3.2]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={1}
            chromaticAberration={0.025}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.1}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
            color="#3B82F6"
          />
        </mesh>
        
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.2, 3.2, 3.2)]} />
          <lineBasicMaterial color="#06B6D4" transparent opacity={0.4} />
        </lineSegments>

        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.2} />
        </mesh>
      </Float>
      
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[Math.sin(i) * 5, Math.cos(i) * 5, Math.sin(i * 0.5) * 2]}>
            <octahedronGeometry args={[0.2]} />
            <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

const placeholders = [
  "Summarize today's strategy meeting",
  "Find all action items for Sarah",
  "Extract deadlines from the product sync",
  "Generate AI insights from Q3 planning",
  "What were the key decisions made?"
];

export default function Hero() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = placeholders[placeholderIndex];
      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, placeholderIndex, typingSpeed]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [particles] = useState(() => 
    [...Array(15)].map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      floatY: Math.random() * -100,
      duration: 5 + Math.random() * 10,
    }))
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        
        <motion.div
          style={{ y: y1, opacity }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-brand-blue/20 w-fit shadow-xl shadow-brand-blue/5">
            <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
            <span className="text-sm font-bold tracking-widest text-brand-blue uppercase">
              The Intelligence Layer for Meetings
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-foreground">
            Transform <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-neon-blue to-cyan-glow">
                Meetings
              </span>
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                className="absolute bottom-4 left-0 h-4 bg-brand-blue/10 -z-10 rounded-full"
              />
            </span>{" "}
            <br />
            Into Action.
          </h1>

          <p className="text-xl sm:text-2xl text-foreground/60 max-w-xl leading-relaxed font-medium">
            Next-gen meeting intelligence that auto-extracts tasks, summaries, and action items with pixel-perfect precision.
          </p>

          <div className="relative max-w-2xl group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue via-cyan-glow to-brand-blue rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-1000 group-focus-within:opacity-50" />
            <div className="relative flex items-center bg-background/40 backdrop-blur-2xl border border-foreground/10 rounded-2xl p-2 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/5 text-foreground/40">
                <Command className="w-6 h-6" />
              </div>
              <div className="flex-grow px-4">
                <div className="text-lg text-foreground/80 font-medium">
                  {displayText}
                  <span className="w-0.5 h-6 bg-brand-blue ml-1 inline-block animate-pulse align-middle" />
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                Execute <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login"
                className="px-10 py-5 bg-brand-blue text-white font-black rounded-2xl flex items-center gap-3 shadow-2xl shadow-brand-blue/20 transition-all text-lg group"
              >
                Get Started <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              className="px-10 py-5 glass text-foreground font-black rounded-2xl flex items-center gap-3 border border-foreground/10 transition-all text-lg"
            >
              <Play className="w-6 h-6 text-brand-blue" /> Watch Cinematic Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
          className="h-[600px] lg:h-[800px] w-full relative"
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-20 right-0 z-20 glass p-5 rounded-2xl border-l-4 border-l-brand-blue shadow-2xl max-w-xs"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">AI Insight</h4>
                  <p className="text-xs text-foreground/40">Real-time Analysis</p>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground/70">"Detected critical deadline for Project X-Alpha. Auto-scheduling follow-up."</p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 z-20 glass p-6 rounded-2xl border-t-4 border-t-cyan-glow shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-10">
                <span className="text-sm font-bold text-foreground/60 uppercase tracking-widest">Transcription Accuracy</span>
                <span className="text-xl font-black text-cyan-glow">99.8%</span>
              </div>
              <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "99.8%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-cyan-glow"
                />
              </div>
            </div>
          </motion.div>

          <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#3B82F6" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#06B6D4" />
            <HolographicCube />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] -z-10" />
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: p.x, y: p.y, opacity: 0 }}
            animate={{ y: [null, p.y + p.floatY], opacity: [0, 0.2, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-brand-blue rounded-full"
          />
        ))}
      </div>
    </section>
  );
}
