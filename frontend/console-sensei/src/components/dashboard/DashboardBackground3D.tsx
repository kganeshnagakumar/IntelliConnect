import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Grid } from "@react-three/drei";
import { useTheme } from "../ThemeProvider";
import * as THREE from "three";

function MovingGrid({ isDark }: { isDark: boolean }) {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Move the grid towards the camera to create an infinite forward motion effect
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid
        position={[0, -5, -20]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor={isDark ? "#3b82f6" : "#60a5fa"}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={isDark ? "#1e40af" : "#2563eb"}
        fadeDistance={50}
        fadeStrength={1}
      />
    </group>
  );
}

export default function DashboardBackground3D() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <div className="absolute inset-0 pointer-events-none z-[-5]">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <fog attach="fog" args={[isDark ? "#09090b" : "#ffffff", 10, 40]} />
        <ambientLight intensity={0.5} />
        <MovingGrid isDark={isDark} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
