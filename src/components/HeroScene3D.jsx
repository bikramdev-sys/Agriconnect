import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 1. Classic Red American/Indian Farm Barn with Gable Roof & Interior Glow
function RedBarn({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone Foundation */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.16, 1.3]} />
        <meshStandardMaterial color="#6B7280" roughness={0.9} />
      </mesh>

      {/* Main Barn Red Body */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.0, 1.2]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.7} />
      </mesh>

      {/* White Wooden Corner Trim Pillars */}
      {[-0.76, 0.76].map((x, i) =>
        [-0.61, 0.61].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.65, z]}>
            <boxGeometry args={[0.08, 1.02, 0.08]} />
            <meshStandardMaterial color="#F9FAFB" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Pitched Roof (Gambrel Profile) */}
      <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.15, 1.15, 1.34]} />
        <meshStandardMaterial color="#1F2937" roughness={0.6} />
      </mesh>

      {/* Front Gable Wall (Red Triangle) */}
      <mesh position={[0, 1.25, 0.61]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.85, 0.6, 4]} />
        <meshStandardMaterial color="#991B1B" roughness={0.7} />
      </mesh>

      {/* Barn Front Sliding Double Doors (Wood Plank with White Cross) */}
      <mesh position={[0, 0.5, 0.61]}>
        <boxGeometry args={[0.65, 0.75, 0.04]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.8} />
      </mesh>
      {/* White Door Frame & Diagonal Bracing */}
      <mesh position={[0, 0.5, 0.63]}>
        <boxGeometry args={[0.04, 0.75, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[-0.16, 0.5, 0.63]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.03, 0.7, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0.16, 0.5, 0.63]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.03, 0.7, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>

      {/* Barn Loft Window with Warm Golden Light Glow */}
      <mesh position={[0, 1.25, 0.62]}>
        <boxGeometry args={[0.3, 0.3, 0.04]} />
        <meshStandardMaterial
          color="#FEF08A"
          emissive="#F59E0B"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      {/* Window Crossbar */}
      <mesh position={[0, 1.25, 0.64]}>
        <boxGeometry args={[0.3, 0.04, 0.02]} />
        <meshStandardMaterial color="#1F2937" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.25, 0.64]}>
        <boxGeometry args={[0.04, 0.3, 0.02]} />
        <meshStandardMaterial color="#1F2937" roughness={0.5} />
      </mesh>

      {/* Warm Ambient Barn Light */}
      <pointLight position={[0, 0.6, 0.8]} color="#FDE047" intensity={0.9} distance={2.5} />
    </group>
  );
}

// 2. Rotating Windmill with Realistic Lattice Sails
function Windmill({ position = [0, 0, 0], scale = 1 }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 0.9;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Stone Base Podium */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.52, 0.4, 8]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.9} />
      </mesh>

      {/* Tapered Timber/Stone Tower Body */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.42, 1.3, 8]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.6} />
      </mesh>

      {/* Dark Conical Cap / Roof */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <coneGeometry args={[0.38, 0.45, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>

      {/* Rotor Axle Hub (Front projecting shaft) */}
      <mesh position={[0, 1.62, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
        <meshStandardMaterial color="#1F2937" roughness={0.5} />
      </mesh>

      {/* Rotating 4-Blade Lattice Sails */}
      <group ref={bladesRef} position={[0, 1.62, 0.42]}>
        {/* Central Hub Cap */}
        <mesh position={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* 4 Sails spaced 90 degrees apart */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
          <group key={idx} rotation={[0, 0, angle]}>
            {/* Wooden Spar */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[0.04, 1.3, 0.03]} />
              <meshStandardMaterial color="#78350F" roughness={0.8} />
            </mesh>
            {/* White Fabric Lattice Sail */}
            <mesh position={[0.1, 0.75, 0.01]} castShadow>
              <boxGeometry args={[0.18, 0.9, 0.015]} />
              <meshStandardMaterial color="#F9FAFB" roughness={0.4} />
            </mesh>
            {/* Grid lines on sail */}
            {[0.4, 0.65, 0.9, 1.15].map((y, k) => (
              <mesh key={k} position={[0.1, y, 0.02]}>
                <boxGeometry args={[0.18, 0.02, 0.01]} />
                <meshStandardMaterial color="#92400E" roughness={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

// 3. Iconic Modern Farm Tractor (Forest Green & Vibrant Yellow Wheels)
function FarmTractor({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Body Engine Hood */}
      <mesh position={[0, 0.28, 0.22]} castShadow>
        <boxGeometry args={[0.42, 0.32, 0.58]} />
        <meshStandardMaterial color="#15803D" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Front Engine Grille (Dark Charcoal) */}
      <mesh position={[0, 0.26, 0.52]} castShadow>
        <boxGeometry args={[0.38, 0.26, 0.04]} />
        <meshStandardMaterial color="#1F2937" roughness={0.8} />
      </mesh>

      {/* Front Headlights */}
      {[-0.14, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0.34, 0.53]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#FEF08A"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Driver Cabin (Glass & Green Roof) */}
      <mesh position={[0, 0.52, -0.15]}>
        <boxGeometry args={[0.4, 0.38, 0.44]} />
        <meshPhysicalMaterial
          color="#93C5FD"
          transmission={0.7}
          roughness={0.2}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Cabin Roof */}
      <mesh position={[0, 0.72, -0.15]} castShadow>
        <boxGeometry args={[0.44, 0.06, 0.48]} />
        <meshStandardMaterial color="#166534" roughness={0.4} />
      </mesh>
      {/* Cabin Pillars */}
      {[-0.19, 0.19].map((x, i) =>
        [-0.34, 0.05].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.52, z]}>
            <boxGeometry args={[0.03, 0.38, 0.03]} />
            <meshStandardMaterial color="#1F2937" roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Vertical Chrome Exhaust Pipe */}
      <mesh position={[0.16, 0.54, 0.28]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Rear Big Wheels (Rubber Tire + Bright Yellow Rim) */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={`rear-${i}`} position={[x, 0.32, -0.22]}>
          {/* Black Rubber Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.14, 18]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
          {/* Yellow Hub Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.15, 12]} />
            <meshStandardMaterial color="#FACC15" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Center Axle Nut */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.17, 8]} />
            <meshStandardMaterial color="#1F2937" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Front Small Wheels (Rubber Tire + Yellow Rim) */}
      {[-0.23, 0.23].map((x, i) => (
        <group key={`front-${i}`} position={[x, 0.18, 0.38]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.11, 12]} />
            <meshStandardMaterial color="#FACC15" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 4. Furrowed Crop Patch & Golden Wheat Field
function CropFields() {
  return (
    <group position={[0.7, 0.12, -0.4]}>
      {/* 4 Raised Brown Soil Furrows */}
      {[-0.35, -0.12, 0.12, 0.35].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* Earth Mound */}
          <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.08, 0.16]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          {/* Rows of Fresh Crops along the mound */}
          {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((x, k) => (
            <mesh key={k} position={[x, 0.11, 0]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#22C55E' : '#EAB308'}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// 5. Rolled Golden Hay Bales
function HayBale({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.42, 16]} />
        <meshStandardMaterial color="#EAB308" roughness={0.85} />
      </mesh>
      {/* Darker Binder Twine Strings */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.182, 0.01, 8, 24]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 6. Charming Apple & Pine Trees
function AppleTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Tree Trunk */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.7, 8]} />
        <meshStandardMaterial color="#78350F" roughness={0.9} />
      </mesh>
      {/* Fluffy Green Foliage Canopy */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <dodecahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial color="#15803D" roughness={0.6} />
      </mesh>
      {/* Ripe Red Apples on Tree */}
      {[
        [0.2, 0.8, 0.3],
        [-0.25, 0.9, 0.2],
        [0.15, 1.0, -0.2],
        [-0.18, 0.75, -0.25]
      ].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// 7. White Wooden Perimeter Fence
function FarmFence() {
  const posts = [
    [-1.8, 0.2, -0.5],
    [-1.8, 0.2, 0.0],
    [-1.8, 0.2, 0.5],
    [-1.8, 0.2, 1.0],
    [-1.4, 0.2, 1.2],
    [-0.9, 0.2, 1.3]
  ];

  return (
    <group>
      {/* Vertical Posts */}
      {posts.map((pos, i) => (
        <mesh key={`post-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.32, 0.06]} />
          <meshStandardMaterial color="#F9FAFB" roughness={0.5} />
        </mesh>
      ))}
      {/* Horizontal Rails */}
      <mesh position={[-1.8, 0.28, 0.25]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.5]} />
        <meshStandardMaterial color="#F9FAFB" roughness={0.5} />
      </mesh>
      <mesh position={[-1.8, 0.18, 0.25]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.5]} />
        <meshStandardMaterial color="#F9FAFB" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 8. Winding Dirt Path & Reflective Water Pond
function FarmGroundFeatures() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* Winding Dirt Path (Earthen Road from Barn to Tractor) */}
      <mesh position={[-0.2, 0.015, 0.2]} rotation={[-Math.PI / 2, 0, 0.3]} receiveShadow>
        <planeGeometry args={[0.55, 1.8]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.014, 0.6]} rotation={[-Math.PI / 2, 0, -0.4]} receiveShadow>
        <planeGeometry args={[0.5, 1.2]} />
        <meshStandardMaterial color="#D97706" roughness={0.9} />
      </mesh>

      {/* Small Irrigation Pond (Reflective Blue Water) */}
      <mesh position={[1.2, 0.02, 0.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.55, 32]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          ior={1.33}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Pond Water Lily Pad */}
      <mesh position={[1.1, 0.03, 0.75]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#16A34A" roughness={0.4} />
      </mesh>
    </group>
  );
}

// 9. Floating Soft White Cloud with Gentle Float
function FloatingCloud({ position = [0, 0, 0], scale = 1 }) {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} scale={scale}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0.2, -0.04, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[-0.2, -0.05, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0.12, 0.05]}>
          <sphereGeometry args={[0.19, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

// 10. The Complete 3D Miniature Organic Farm Island
function MasterMiniatureFarm() {
  const islandRef = useRef();

  // Smooth lerp mouse parallax for architectural diorama table feel
  useFrame(({ pointer, clock, camera }) => {
    // Keep camera focused comfortably on the diorama island
    camera.lookAt(0, 0.12, 0);

    if (islandRef.current) {
      const t = clock.getElapsedTime();
      // Very gentle continuous base pan
      const basePan = t * 0.08;

      // Mouse responsive 3D tilt with smooth damping - perfectly tuned to keep the base fully visible without clipping
      const targetY = basePan + pointer.x * 0.28;
      const targetX = 0.12 - pointer.y * 0.07;

      islandRef.current.rotation.y = THREE.MathUtils.lerp(
        islandRef.current.rotation.y,
        targetY,
        0.05
      );
      islandRef.current.rotation.x = THREE.MathUtils.lerp(
        islandRef.current.rotation.x,
        targetX,
        0.05
      );
    }
  });

  return (
    <group ref={islandRef} position={[0, 0.08, 0]} scale={0.58}>
      {/* Island Floating Base (Diorama Cylinder with Grass Top & Rich Earth Layer) */}
      <group position={[0, -0.25, 0]}>
        {/* Lush Green Top Grass Layer */}
        <mesh receiveShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[2.7, 2.75, 0.35, 48]} />
          <meshStandardMaterial color="#22C55E" roughness={0.7} />
        </mesh>
        {/* Deep Fertile Soil Bedrock Layer */}
        <mesh receiveShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[2.75, 2.85, 0.45, 48]} />
          <meshStandardMaterial color="#78350F" roughness={0.9} />
        </mesh>
        {/* Dark Sub-crust Base */}
        <mesh receiveShadow position={[0, -0.55, 0]}>
          <cylinderGeometry args={[2.85, 2.9, 0.25, 48]} />
          <meshStandardMaterial color="#451A03" roughness={0.95} />
        </mesh>
      </group>

      {/* Surface Features: Dirt Path & Irrigation Pond */}
      <FarmGroundFeatures />

      {/* 1. Red Barn (Anchored at upper-left) */}
      <RedBarn position={[-0.85, 0.0, -0.65]} rotation={[0, 0.35, 0]} scale={0.95} />

      {/* 2. Rotating Windmill (Upper-right hill) */}
      <Windmill position={[1.4, 0.0, -0.85]} scale={0.95} />

      {/* 3. Green & Yellow Farm Tractor (Parked on path near center) */}
      <FarmTractor position={[0.1, 0.0, 0.55]} rotation={[0, -0.7, 0]} scale={1.0} />

      {/* 4. Furrowed Crop Rows & Veggie Patch */}
      <CropFields />

      {/* 5. Rolled Golden Hay Bales */}
      <HayBale position={[-0.2, 0.1, -0.9]} rotation={[0, 0.5, 0]} />
      <HayBale position={[-0.45, 0.1, -1.05]} rotation={[0, -0.3, 0]} />
      <HayBale position={[0.2, 0.1, 1.25]} rotation={[0, 0.8, 0]} />

      {/* 6. Orchard Apple Trees */}
      <AppleTree position={[-1.7, 0.0, -0.2]} scale={1.05} />
      <AppleTree position={[-1.35, 0.0, 0.65]} scale={0.9} />
      <AppleTree position={[1.7, 0.0, 0.1]} scale={0.95} />

      {/* 7. Perimeter Farm Fences */}
      <FarmFence />

      {/* 8. Floating Soft Clouds */}
      <FloatingCloud position={[-0.8, 1.5, -0.4]} scale={0.8} />
      <FloatingCloud position={[1.4, 1.6, 0.3]} scale={0.65} />

      {/* Ground Contact Shadow for Realistic Depth (Positioned cleanly below the base cylinder) */}
      <ContactShadows
        position={[0, -0.96, 0]}
        opacity={0.6}
        scale={7.0}
        blur={2.2}
        far={4.0}
        color="#052E16"
      />
    </group>
  );
}

// Fallback component while loading or if WebGL is unavailable
function SceneFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-forest-50 via-white to-emerald-50 rounded-3xl border border-forest-100">
      <div className="w-20 h-20 rounded-full bg-forest-900 text-fresh flex items-center justify-center text-3xl mb-4 shadow-soft">
        🚜
      </div>
      <h4 className="font-display font-extrabold text-forest-950 text-lg">Direct from Indian Farms</h4>
      <p className="text-agriText-muted text-xs max-w-xs mt-1">
        Verified growers, fresh field harvests, and transparent prices delivered to your doorstep.
      </p>
    </div>
  );
}

export default function HeroScene3D() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <SceneFallback />;
  }

  return (
    <div className="w-full h-[360px] sm:h-[480px] lg:h-[600px] relative select-none">
      <Suspense fallback={<SceneFallback />}>
        <Canvas
          shadows
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Isometric Perspective Camera positioned with ample vertical clearance */}
          <PerspectiveCamera makeDefault position={[0, 2.5, 5.8]} fov={38} />

          {/* Warm Golden Morning Farm Sunlight */}
          <directionalLight
            position={[6, 9, 5]}
            intensity={2.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={4}
            shadow-camera-bottom={-4}
            color="#FFFBEB"
          />

          {/* Soft Sky & Meadow Fill Light */}
          <ambientLight intensity={0.9} color="#F0FDF4" />

          {/* Backlit Emerald Rim Light */}
          <directionalLight position={[-5, 5, -4]} intensity={1.5} color="#86EFAC" />

          {/* Ground Warm Bounce */}
          <directionalLight position={[0, -4, 2]} intensity={0.4} color="#FDE047" />

          {/* Master Miniature 3D Farm Diorama */}
          <MasterMiniatureFarm />
        </Canvas>
      </Suspense>
    </div>
  );
}
