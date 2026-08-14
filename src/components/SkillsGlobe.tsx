import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { GlobeSkill } from '@/constants/skills';
import { getIcon } from '@/utils/icons';

// ----------------------------------------------------------------
// Seeded RNG — stable positions across re-renders
// ----------------------------------------------------------------

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
// Ambient energy dust
// ----------------------------------------------------------------

function FloatingDust({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const rng = mulberry32(11);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi   = Math.acos(rng() * 2 - 1);
      const r     = 2.5 + rng() * 1.2;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#ffffff" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ----------------------------------------------------------------
// Nucleus — single large luminous sphere, like the Bohr model icon
// ----------------------------------------------------------------

function Nucleus() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) meshRef.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.04);
  });

  return (
    <group>
      <pointLight intensity={8} distance={3.5} color="#c7d2fe" />
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.38, 48, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#a5b4fc"
          emissiveIntensity={2.2}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[0.58, 32, 32]} />
        <meshBasicMaterial color="#c7d2fe" transparent opacity={0.06} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------
// Orbit Ring — 3D tube ellipse + orbiting electron with ghost trail
// ----------------------------------------------------------------

interface OrbitRingProps {
  rotation: [number, number, number];
  radiusX: number;
  radiusY: number;
  tubeRadius?: number;
  speed: number;
  startOffset?: number;
}

function OrbitRing({
  rotation,
  radiusX,
  radiusY,
  tubeRadius = 0.045,
  speed,
  startOffset = 0,
}: OrbitRingProps) {
  // Parametric ellipse path for TubeGeometry
  const tubeCurve = useMemo(() => {
    class EllipseCurve3D extends THREE.Curve<THREE.Vector3> {
      constructor(private rx: number, private ry: number) { super(); }
      getPoint(t: number): THREE.Vector3 {
        const a = t * Math.PI * 2;
        return new THREE.Vector3(this.rx * Math.cos(a), this.ry * Math.sin(a), 0);
      }
    }
    return new EllipseCurve3D(radiusX, radiusY);
  }, [radiusX, radiusY]);

  const TRAIL = 10;
  const electronRef = useRef<THREE.Mesh>(null!);
  const trailRefs   = useRef<(THREE.Mesh | null)[]>(Array(TRAIL).fill(null));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    for (let i = 0; i <= TRAIL; i++) {
      const theta = (t * speed + startOffset) - i * 0.055;
      const x = radiusX * Math.cos(theta);
      const y = radiusY * Math.sin(theta);
      if (i === 0) {
        electronRef.current?.position.set(x, y, 0);
      } else {
        trailRefs.current[i - 1]?.position.set(x, y, 0);
      }
    }
  });

  return (
    <group rotation={rotation}>
      {/* 3D tube ring */}
      <mesh>
        <tubeGeometry args={[tubeCurve, 200, tubeRadius, 12, true]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#818cf8"
          emissiveIntensity={0.75}
          roughness={0.12}
          metalness={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Electron */}
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0e7ff" emissiveIntensity={4.0} roughness={0.05} />
        <pointLight intensity={5} distance={1.8} color="#c7d2fe" />
      </mesh>

      {/* Ghost trail */}
      {Array.from({ length: TRAIL }).map((_, idx) => {
        const f = (TRAIL - idx) / (TRAIL + 1);
        return (
          <mesh key={idx} ref={(el) => { trailRefs.current[idx] = el; }}>
            <sphereGeometry args={[0.11 * f, 8, 8]} />
            <meshBasicMaterial color="#a5b4fc" transparent opacity={0.58 * f} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

// ----------------------------------------------------------------
// Classic Bohr atom:
//   3 identical ellipses, each rotated 60° around Y,
//   all tilted ~32° from horizontal (to read as 3D).
// ----------------------------------------------------------------

const ORBIT_CONFIGS: OrbitRingProps[] = [
  {
    rotation: [Math.PI * 0.18, 0, 0],
    radiusX: 2.1, radiusY: 0.72,
    speed: 1.5, startOffset: 0,
  },
  {
    rotation: [Math.PI * 0.18, Math.PI / 3, 0],
    radiusX: 2.1, radiusY: 0.72,
    speed: 1.5, startOffset: (Math.PI * 2) / 3,
  },
  {
    rotation: [Math.PI * 0.18, (Math.PI * 2) / 3, 0],
    radiusX: 2.1, radiusY: 0.72,
    speed: 1.5, startOffset: (Math.PI * 4) / 3,
  },
];

/** Scene root — slow Y-rotation lets you see all three rings at once. */
function SkillsSphere() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.20;
  });

  return (
    <group ref={groupRef}>
      <Nucleus />
      {ORBIT_CONFIGS.map((cfg, i) => <OrbitRing key={i} {...cfg} />)}
      <FloatingDust />
    </group>
  );
}

// ----------------------------------------------------------------
// Static fallback (prefers-reduced-motion)
// ----------------------------------------------------------------

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
            <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
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
 * SkillsGlobe — interactive 3D Bohr model atom (classic atom-symbol aesthetic).
 *
 * Drop a list of skills into the `skills` prop. Each entry needs:
 *   - `name`:  string shown in the fallback grid
 *   - `icon`:  string matching a key in `src/utils/icons.ts`
 *   - `color`: optional (unused in white theme)
 *   - `category`: optional grouping
 */
export function SkillsGlobe({ skills }: SkillsGlobeProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq     = window.matchMedia('(prefers-reduced-motion: reduce)');
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
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]}   intensity={1.6} color="#ffffff" />
          <directionalLight position={[-5, -3, -4]} intensity={0.9} color="#c7d2fe" />
          <pointLight       position={[0, 0, 5]}    intensity={0.8} color="#ffffff" />

          <SkillsSphere />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={4}
            maxDistance={11}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}