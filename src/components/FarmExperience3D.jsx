import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { RotateCcw, Compass, Sun, Wind } from 'lucide-react';
import * as THREE from 'three';

// Low-poly Tree
function Tree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
        <meshStandardMaterial color="#78350F" roughness={0.8} />
      </mesh>
      {/* Foliage Cones */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <coneGeometry args={[0.65, 0.8, 7]} />
        <meshStandardMaterial color="#15803D" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <coneGeometry args={[0.5, 0.7, 7]} />
        <meshStandardMaterial color="#22C55E" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <coneGeometry args={[0.35, 0.6, 7]} />
        <meshStandardMaterial color="#4ADE80" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Low-poly Modern Windmill with spinning blades
function Windmill({ position = [0, 0, 0], scale = 1 }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Tower base */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 2.4, 8]} />
        <meshStandardMaterial color="#F4F4EB" roughness={0.7} />
      </mesh>
      {/* Hub */}
      <mesh position={[0, 2.4, 0.25]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#14532D" roughness={0.5} />
      </mesh>
      {/* Rotating Blades */}
      <group ref={bladesRef} position={[0, 2.4, 0.32]}>
        {[0, 120, 240].map((deg, i) => (
          <group key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[0.12, 1.4, 0.02]} />
              <meshStandardMaterial color="#22C55E" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// Low-poly Red Barn
function FarmBarn({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main barn body */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 2.0]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.7} />
      </mesh>
      {/* Roof peak */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[1.25, 0.6, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#450A0A" roughness={0.6} />
      </mesh>
      {/* Barn Door */}
      <mesh position={[0, 0.45, 1.01]}>
        <boxGeometry args={[0.6, 0.9, 0.04]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
      </mesh>
      {/* Door X cross */}
      <mesh position={[0, 0.45, 1.03]}>
        <boxGeometry args={[0.5, 0.06, 0.02]} rotation={[0, 0, 0.7]} />
        <meshStandardMaterial color="#B91C1C" />
      </mesh>
      <mesh position={[0, 0.45, 1.03]}>
        <boxGeometry args={[0.5, 0.06, 0.02]} rotation={[0, 0, -0.7]} />
        <meshStandardMaterial color="#B91C1C" />
      </mesh>
    </group>
  );
}

// Stylized Green Tractor
function Tractor({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.8 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Hood */}
      <mesh position={[0, 0.35, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.7]} />
        <meshStandardMaterial color="#16A34A" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Cab roof */}
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.52, 0.5, 0.5]} />
        <meshStandardMaterial color="#14532D" roughness={0.4} />
      </mesh>
      {/* Cab Glass */}
      <mesh position={[0, 0.65, 0.06]}>
        <boxGeometry args={[0.48, 0.3, 0.04]} />
        <meshStandardMaterial color="#BAE6FD" roughness={0.1} />
      </mesh>
      {/* Big Rear Wheels */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={`rw-${i}`} position={[x, 0.35, -0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.9} />
        </mesh>
      ))}
      {/* Small Front Wheels */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={`fw-${i}`} position={[x, 0.2, 0.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.9} />
        </mesh>
      ))}
      {/* Yellow Rims */}
      {[-0.33, 0.33].map((x, i) => (
        <mesh key={`rim-${i}`} position={[x, 0.35, -0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.16, 12]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} />
        </mesh>
      ))}
      {/* Exhaust Pipe */}
      <mesh position={[0.2, 0.65, 0.45]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
    </group>
  );
}

// Gentle Floating Cloud
function Cloud({ position = [0, 0, 0], scale = 1, speed = 0.5 }) {
  const cloudRef = useRef();

  useFrame(({ clock }) => {
    if (cloudRef.current) {
      cloudRef.current.position.x =
        position[0] + Math.sin(clock.getElapsedTime() * 0.2 * speed) * 0.5;
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 0.05, 0]}>
        <sphereGeometry args={[0.32, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[-0.3, -0.05, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Crop rows with textured mounds
function CropRows({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {[-1.2, -0.7, -0.2, 0.3, 0.8].map((z, i) => (
        <group key={i} position={[0, 0.05, z]}>
          {/* Soil ridge */}
          <mesh receiveShadow>
            <boxGeometry args={[3.4, 0.08, 0.32]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          {/* Lush Green crops planted in this row */}
          {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.4].map((x, j) => (
            <mesh key={j} position={[x, 0.14, 0]} castShadow>
              <sphereGeometry args={[0.09, 6, 6]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#22C55E' : '#4ADE80'} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Main Landscape
function LandscapeScene() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Wide green terrain base */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[6.2, 6.5, 0.6, 32]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} />
      </mesh>
      {/* Deep earthy soil foundation */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[6.5, 6.7, 0.4, 32]} />
        <meshStandardMaterial color="#451A03" roughness={0.9} />
      </mesh>

      {/* Rolling hillocks in background */}
      <mesh position={[-2.8, 0.3, -2.5]} receiveShadow>
        <sphereGeometry args={[2.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
      <mesh position={[2.6, 0.2, -2.2]} receiveShadow>
        <sphereGeometry args={[2.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#14532D" roughness={0.8} />
      </mesh>

      {/* Winding dirt pathway */}
      <mesh position={[0.2, 0.32, 0.4]} rotation={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.02, 4.2]} />
        <meshStandardMaterial color="#D97706" roughness={0.95} />
      </mesh>

      {/* Buildings & Assets */}
      <FarmBarn position={[-2.2, 0.32, -0.8]} rotation={[0, 0.4, 0]} scale={0.9} />
      <Windmill position={[2.5, 0.32, -1.2]} scale={0.85} />
      <Tractor position={[0.4, 0.32, 1.2]} rotation={[0, 0.3, 0]} scale={0.85} />

      {/* Crop Rows */}
      <CropRows position={[-0.8, 0.3, 0.8]} />

      {/* Trees along the hills and edges */}
      <Tree position={[-3.6, 0.32, 0.5]} scale={1.1} />
      <Tree position={[-2.8, 0.5, -2.6]} scale={1.2} />
      <Tree position={[-1.4, 0.32, -2.4]} scale={0.9} />
      <Tree position={[1.4, 0.32, -2.8]} scale={1.0} />
      <Tree position={[3.5, 0.32, -0.2]} scale={1.15} />
      <Tree position={[3.2, 0.32, 1.5]} scale={0.85} />

      {/* Floating Low-poly Clouds */}
      <Cloud position={[-2.5, 3.2, -1.0]} scale={1.2} speed={1.1} />
      <Cloud position={[1.8, 3.6, 0.5]} scale={1.0} speed={0.9} />
      <Cloud position={[0.2, 3.0, -2.2]} scale={0.9} speed={1.3} />

      {/* Contact Shadow */}
      <ContactShadows position={[0, -0.68, 0]} opacity={0.45} scale={14} blur={2.5} far={4} color="#052E16" />
    </group>
  );
}

export default function FarmExperience3D() {
  const controlsRef = useRef();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#EFF9F1] via-[#FAFAF5] to-[#F3F7F2] border border-forest-100/80 shadow-premium">
      {/* 3D Scene Controls Header Overlay */}
      <div className="absolute top-3 sm:top-4 left-3 right-3 sm:left-4 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 sm:gap-3 pointer-events-none">
        <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl flex items-center space-x-2 text-xs font-semibold text-forest-900 pointer-events-auto shadow-sm">
          <Compass className="w-4 h-4 text-forest-600 animate-spin-slow shrink-0" />
          <span><span className="hidden sm:inline">Interactive 3D Farm: </span>Drag to orbit, scroll to zoom</span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={handleResetCamera}
            className="glass-card hover:bg-white text-forest-800 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
            title="Reset to default viewpoint"
          >
            <RotateCcw className="w-3.5 h-3.5 text-forest-600" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="w-full h-[320px] sm:h-[440px] lg:h-[580px] cursor-grab active:cursor-grabbing select-none">
        {hasWebGL ? (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-forest-700 font-medium">
                Loading 3D Farm Landscape...
              </div>
            }
          >
            <Canvas
              shadows
              dpr={[1, 1.8]}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full"
            >
              <PerspectiveCamera makeDefault position={[0, 4.5, 8.5]} fov={38} />
              <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.06}
                maxPolarAngle={Math.PI / 2.1} // Prevent looking from underground
                minDistance={4}
                maxDistance={14}
              />

              {/* Lighting */}
              <ambientLight intensity={0.8} color="#FEFCE8" />
              <directionalLight
                position={[8, 12, 6]}
                intensity={1.9}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
                color="#FFFDF0"
              />
              <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#86EFAC" />

              <LandscapeScene />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-forest-100 text-3xl flex items-center justify-center mb-3">
              🚜
            </div>
            <h4 className="font-display font-bold text-forest-900 text-lg">Interactive 3D Farm</h4>
            <p className="text-agriText-muted text-sm max-w-md mt-1">
              Explore sustainable farm beds, regenerative soil practices, and direct-to-buyer logistics.
            </p>
          </div>
        )}
      </div>

      {/* Floating feature pills footer overlay */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 pointer-events-none">
        <div className="glass-card px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center space-x-1.5 text-[10px] sm:text-xs text-forest-900 font-medium">
          <Sun className="w-3.5 h-3.5 text-accent-amber" />
          <span>Natural Solar Irrigation</span>
        </div>
        <div className="glass-card px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center space-x-1.5 text-[10px] sm:text-xs text-forest-900 font-medium">
          <Wind className="w-3.5 h-3.5 text-fresh" />
          <span>Zero Chemical Drift</span>
        </div>
        <div className="glass-card px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center space-x-1.5 text-[10px] sm:text-xs text-forest-900 font-medium">
          <span className="w-2 h-2 rounded-full bg-fresh animate-ping" />
          <span>Real-time Field Harvests</span>
        </div>
      </div>
    </div>
  );
}
