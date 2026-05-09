import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

const DynamicBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    await loadFull(engine);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
          particles: {
            color: {
              value: ["#FFD700", "#ff8c00", "#ffffff"],
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.6,
            },
            shape: {
              type: ["circle", "polygon"],
              options: {
                  polygon: {
                      sides: 6
                  }
              }
            },
            size: {
              value: { min: 2, max: 6 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default DynamicBackground;
