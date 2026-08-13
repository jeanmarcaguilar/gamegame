import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GlobeSkill } from '@/constants/skills';
import { getIcon } from '@/utils/icons';

// ----------------------------------------------------------------
// Visual tokens — transparent-white aesthetic.
// All elements share these so the look stays cohesive.
// ----------------------------------------------------------------

/** Soft white palette — pure whites with a hint of cool blue tint. */
const PALETTE = {
  // Sphere / wireframe / ring — brightened so the globe glows.
  white: '#ffffff',
  pearl: 'rgba(255, 255, 255, 0.95)',
  wire: 'rgba(255, 255, 255, 0.32)',
  wireStrong: 'rgba(255, 255, 255, 0.55)',
  // Glass tints
  glassFill: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.25)',
  // Particle dust
  dust: '#ffffff',
  // Hover accent — a single subtle warm pearl
  hover: '#f8fafc',
  hoverGlow: 'rgba(255, 255, 255, 0.8)',
} as const;

/** Sphere geometry radius — every other distance is derived from this. */
const GLOBE_RADIUS = 2.0;


/** Auto-rotation speed in rad/sec when idle. */
const AUTO_ROTATE_SPEED = 0.18;

// ----------------------------------------------------------------
// Geometry helpers
// ----------------------------------------------------------------


/** Seeded RNG for stable particle layout across renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------
// Scene sub-components
// ----------------------------------------------------------------

/** Subtle floating white dust — replaces the cyan particle cloud. */
function FloatingDust({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const rng = mulberry32(11);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(rng() * 2 - 1);
      const r = GLOBE_RADIUS + 0.4 + rng() * 1.6;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.025;
      ref.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={PALETTE.dust}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Frosted-glass sphere — a real transparent shell plus a white wireframe
 *  overlay so the lat/lon grid still reads. */
function GlassGlobe({
  radius = GLOBE_RADIUS,
}: {
  radius?: number;
}) {
  return (
    <group>
      {/* Glass shell — uses MeshPhysicalMaterial for actual refraction.
         With no scene background, the page theme shows through. */}
      <mesh>
        <sphereGeometry args={[radius, 48, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.03}
          roughness={0.15}
          metalness={0}
          transmission={0.95}
          thickness={0.4}
          ior={1.35}
          attenuationColor="#ffffff"
          attenuationDistance={5}
          clearcoat={0.7}
          clearcoatRoughness={0.08}
          envMapIntensity={0.8}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer wireframe — a clean white lat/lon grid. */}
      <mesh>
        <sphereGeometry args={[radius * 1.001, 36, 24]} />
        <meshBasicMaterial
          color={PALETTE.wire}
          wireframe
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      {/* Stronger wire equator — single bold ring at the equator. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.005, 0.008, 10, 192]} />
        <meshBasicMaterial
          color={PALETTE.wireStrong}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* A subtle meridian accent. */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius * 1.005, 0.005, 10, 192]} />
        <meshBasicMaterial
          color={PALETTE.wire}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}


/** Rotating container holding the glass globe and skill tags. */
function SkillsSphere() {
  const groupRef = useRef<THREE.Group>(null!);

  // Continuous Y-axis auto-rotation of the sphere itself.
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
  });


  return (
    <group ref={groupRef}>
      <GlassGlobe radius={GLOBE_RADIUS} />
      <FloatingDust />
    </group>
  );
}

/** Static chip-grid fallback for prefers-reduced-motion. */
function StaticFallback({ skills }: { skills: GlobeSkill[] }) {
  return (
    <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4" role="list">
      {skills.map((skill) => {
        const Icon = getIcon(skill.icon);
        return (
          <div
            key={skill.name}
            role="listitem"
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md"
          >
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">{skill.name}</span>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------
// Public component
// ----------------------------------------------------------------

interface SkillsGlobeProps {
  skills: GlobeSkill[];
}

/**
 * SkillsGlobe — interactive 3D technology sphere (transparent-white aesthetic).
 *
 * Drop a list of skills into the `skills` prop. Each entry needs:
 *   - `name`:  string shown beneath the icon
 *   - `icon`:  string matching a key in `src/utils/icons.ts`
 *   - `color`: optional accent (unused in white theme)
 *   - `category`: optional grouping for the HUD
 */
export function SkillsGlobe({ skills }: SkillsGlobeProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);


  if (reducedMotion) {
    return (
      <div className="flex h-full w-full items-center justify-center px-2">
        <StaticFallback skills={skills} />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          premultipliedAlpha: false,
        }}
        style={{ background: 'transparent' }}
      >
        {/* No scene background — the page bleeds through for true transparency. */}
        <Suspense fallback={null}>
          <ambientLight intensity={1.05} />
          <directionalLight position={[5, 5, 5]} intensity={1.6} color="#ffffff" />
          <directionalLight position={[-5, -3, -4]} intensity={1.0} color="#c7d2fe" />
          <pointLight position={[0, 0, 5]} intensity={1.0} color="#ffffff" />
          <pointLight position={[3, -2, 4]} intensity={0.7} color="#e0e7ff" />

          <SkillsSphere />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={4}
            maxDistance={11}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>

    </div>
  );
}