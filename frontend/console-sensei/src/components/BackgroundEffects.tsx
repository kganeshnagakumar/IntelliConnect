import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  void main() {
    vec2 p = -1.0 + 2.0 * vUv;
    float time = uTime * 0.2;
    
    for(int n=1; n<8; n++) {
      float i = float(n);
      p.x += 0.7 / i * sin(i * p.y + time + i * 0.3);
      p.y += 0.4 / i * cos(i * p.x + time + i * 0.5);
    }
    
    vec3 color = mix(uColor1, uColor2, 0.5 + 0.5 * sin(p.x + p.y));
    gl_FragColor = vec4(color, 0.15);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function LiquidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uColor1: { value: new THREE.Color("#2563EB") }, // brand-blue
    uColor2: { value: new THREE.Color("#06B6D4") }, // cyan-glow
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
      {/* Three.js Live Background */}
      <div className="absolute inset-0 opacity-40">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 1] }}>
            <LiquidBackground />
          </Canvas>
        </Suspense>
      </div>

      {/* Static Glows for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-brand-blue/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-glow/10 blur-[120px]" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Noise Texture */}
      <div className="noise-bg opacity-10" />
      
      {/* Radial Gradient for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-80" />
    </div>
  );
}
