import type { ReactNode } from "react";
import { useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { CloudLightning, ArrowLeft } from "lucide-react";
import * as THREE from "three";
import { motion } from "framer-motion";

function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[2, 0.6, 128, 32]} />
        <meshPhysicalMaterial
          color="#2563EB"
          emissive="#3B82F6"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel: 3D Visualization */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-blue/5 dark:bg-[#050505] overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 8] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} color="#3B82F6" intensity={1} />
              <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <AbstractShape />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </Suspense>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-cyan-glow p-[1px] glow-box">
              <div className="w-full h-full rounded-xl bg-background group-hover:bg-transparent transition-all flex items-center justify-center">
                <CloudLightning className="w-6 h-6 text-foreground group-hover:text-white" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              IntelliConnect
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="glass-card p-6 rounded-2xl border border-border bg-background/60 backdrop-blur-xl"
          >
            <p className="text-foreground/80 text-lg leading-relaxed italic mb-4">
              "Since deploying IntelliConnect, our team's productivity has skyrocketed. Action items are never missed, and meetings are finally efficient."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
              <div>
                <p className="text-foreground font-semibold text-sm">Elena Rodriguez</p>
                <p className="text-foreground/50 text-xs">VP of Engineering, TechFlow</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="lg:hidden absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-glow/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-brand-blue transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-foreground/60 mb-8">{subtitle}</p>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
