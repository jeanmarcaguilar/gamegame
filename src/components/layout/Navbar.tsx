import { createPortal } from 'react-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { 
  FaHome, 
  FaUser, 
  FaLaptopCode, 
  FaFolderOpen, 
  FaBriefcase, 
  FaAward, 
  FaEnvelope 
} from 'react-icons/fa';
import { navLinks } from '@/constants';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/utils/cn';

const sectionIds = navLinks.map((l) => l.href.slice(1));

const navIconsMap: Record<string, React.ElementType> = {
  home:         FaHome,
  about:        FaUser,
  skills:       FaLaptopCode,
  projects:     FaFolderOpen,
  experience:   FaBriefcase,
  certificates: FaAward,
  contact:      FaEnvelope,
};

interface SplatterDroplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  scale: number;
}

function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let rafId: number;

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastTime || 1;
      const vel = (y - lastY) / dt; // px/ms

      setVelocity(vel);
      setScrolled(y > 60);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);

      lastY = y;
      lastTime = now;

      // Decay velocity to zero after scroll stops
      clearTimeout(rafId as unknown as number);
      rafId = setTimeout(() => setVelocity(0), 100) as unknown as number;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(rafId as unknown as number);
    };
  }, []);

  return { scrolled, progress, velocity };
}

function CapsuleNav({ activeId }: { activeId: string | null }) {
  const { scrolled, progress, velocity } = useScrollState();
  const [droplets, setDroplets] = useState<SplatterDroplet[]>([]);
  const [scrollBubbles, setScrollBubbles] = useState<FloatingBubble[]>([]);

  // Spring-driven squish based on scroll velocity (liquid stretch)
  const scaleY = useSpring(1, { stiffness: 300, damping: 15 });
  const scaleX = useSpring(1, { stiffness: 300, damping: 15 });

  useEffect(() => {
    const clampedVel = Math.max(-2, Math.min(2, velocity));
    if (Math.abs(clampedVel) > 0.05) {
      scaleY.set(1 - Math.abs(clampedVel) * 0.08);
      scaleX.set(1 + Math.abs(clampedVel) * 0.05);
    } else {
      scaleY.set(1);
      scaleX.set(1);
    }
  }, [velocity, scaleX, scaleY]);

  // Click-triggered liquid splatters
  const handleIconClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = e.currentTarget.parentElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Center coordinates of clicked item relative to container
    const centerX = rect.left - containerRect.left + rect.width / 2;
    const centerY = rect.top - containerRect.top + rect.height / 2;

    const count = 6;
    const newDroplets = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 2.0 + Math.random() * 2.5;
      return {
        id: Math.random() + Date.now(),
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });

    setDroplets((prev) => [...prev, ...newDroplets]);

    setTimeout(() => {
      setDroplets((prev) => prev.filter((d) => !newDroplets.includes(d)));
    }, 650);
  }, []);

  // Scroll velocity-triggered floating liquid bubbles
  useEffect(() => {
    const absVel = Math.abs(velocity);
    if (absVel > 0.12) {
      const direction = velocity > 0 ? 1 : -1;
      const count = Math.min(3, Math.ceil(absVel * 6));

      const newBubbles = Array.from({ length: count }).map(() => {
        const x = 10 + Math.random() * 260;
        // Spawn top/bottom edge based on scroll direction
        const startY = direction > 0 ? -4 : 44;
        const targetY = direction > 0 ? -45 - Math.random() * 20 : 85 + Math.random() * 20;
        return {
          id: Math.random() + Date.now(),
          x,
          y: startY,
          targetX: x + (Math.random() - 0.5) * 30,
          targetY,
          scale: 0.35 + Math.random() * 0.65,
        };
      });

      setScrollBubbles((prev) => [...prev, ...newBubbles]);

      setTimeout(() => {
        setScrollBubbles((prev) => prev.filter((b) => !newBubbles.includes(b)));
      }, 800);
    }
  }, [velocity]);

  return createPortal(
    /* Outer layout grid - ensures Capsule is always perfectly centered in the viewport */
    <div
      style={{
        position: 'fixed',
        bottom: scrolled ? '2rem' : '1.5rem',
        left: 0,
        right: 0,
        zIndex: 99999,
        transition: 'bottom 0.45s cubic-bezier(0.22,1,0.36,1)',
      }}
      className="flex justify-center pointer-events-none select-none px-4"
    >
      <div className="w-full max-w-5xl flex items-center justify-between pointer-events-none">
        
        {/* 1. Left Column: holds the logo, aligned to right edge next to capsule */}
        <div className="flex-1 hidden sm:flex justify-end pr-4 pointer-events-auto">
          <a
            href="#home"
            className={cn(
              'group inline-flex items-center justify-center rounded-2xl border p-2 backdrop-blur-xl shadow-lg transition-all duration-300',
              scrolled
                ? 'border-white/25 bg-[#05050A]/95 shadow-[0_0_20px_rgba(255,255,255,0.12)]'
                : 'border-white/10 bg-[#08080C]/80',
              'hover:border-white/35 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)]',
            )}
            aria-label="Go to top"
          >
            <span className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-xl bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-transform duration-300 group-hover:scale-105">
              <span className="font-display text-sm font-black tracking-wider">JM</span>
            </span>
          </a>
        </div>

        {/* 2. Center Column: holds the capsule nav (Always pixel-perfectly centered) */}
        <div className="pointer-events-auto relative flex-shrink-0 flex justify-center">
          {/* Outer liquid squish wrapper */}
          <motion.div
            style={{ scaleY, scaleX }}
            animate={{
              y: scrolled ? -5 : 0,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            {/* Main capsule container */}
            <motion.div
              animate={{
                background: scrolled ? 'rgba(5,5,8,0.98)' : 'rgba(8,8,12,0.88)',
                borderColor: scrolled ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.18)',
                boxShadow: scrolled
                  ? `0 18px 50px rgba(0,0,0,0.95), 0 0 35px rgba(255,255,255,${0.1 + progress * 0.22})`
                  : '0 8px 30px rgba(0,0,0,0.85), 0 0 16px rgba(255,255,255,0.08)',
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.18)',
                padding: '8px 10px',
                backdropFilter: scrolled ? 'blur(36px) saturate(200%)' : 'blur(20px)',
                WebkitBackdropFilter: scrolled ? 'blur(36px) saturate(200%)' : 'blur(20px)',
              }}
            >
              {/* Liquid Gooey Background Canvas Layer */}
              <div 
                className="absolute left-[10px] right-[10px] top-[8px] bottom-[8px] pointer-events-none" 
                style={{ 
                  filter: 'url(#liquid-goo)',
                  overflow: 'visible'
                }}
              >
                {/* Mirroring Layout for Gooey connection nodes */}
                <div className="flex items-center gap-[4px] h-full w-full">
                  {navLinks.map((link) => {
                    const id = link.href.slice(1);
                    const isActive = activeId === id;
                    return (
                      <div
                        key={`node-bg-${id}`}
                        className="relative flex items-center justify-center"
                        style={{ width: 40, height: 40 }}
                      >
                        {/* Small static fluid node */}
                        <div className="w-[10px] h-[10px] rounded-full bg-white/20" />

                        {/* Shared layout active blob that pulls/stretches liquidly */}
                        {isActive && (
                          <motion.div
                            layoutId="liquid-active-blob"
                            className="absolute w-[36px] h-[36px] rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.85)]"
                            transition={{
                              layout: { type: 'spring', stiffness: 220, damping: 22 },
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Click-driven liquid splatter droplets */}
                {droplets.map((drop) => (
                  <motion.div
                    key={drop.id}
                    className="absolute rounded-full bg-white"
                    initial={{ 
                      x: drop.x, 
                      y: drop.y, 
                      width: 14,
                      height: 14,
                      scale: 1 
                    }}
                    animate={{ 
                      x: drop.x + drop.vx * 35, 
                      y: drop.y + drop.vy * 35, 
                      scale: 0 
                  }}
                  transition={{ 
                    duration: 0.65, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                />
              ))}

              {/* Scroll velocity-driven floating liquid bubbles */}
              {scrollBubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  className="absolute rounded-full bg-white/80"
                  initial={{ 
                    x: bubble.x, 
                    y: bubble.y, 
                    width: 10,
                    height: 10,
                    scale: bubble.scale 
                  }}
                  animate={{ 
                    x: bubble.targetX, 
                    y: bubble.targetY, 
                    scale: 0 
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut" 
                  }}
                />
              ))}
            </div>

            {/* Interactive Foreground Layer */}
            <div className="relative z-10 flex items-center gap-[4px] h-full">
              {navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = activeId === id;
                const Icon = navIconsMap[id] ?? FaHome;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={handleIconClick}
                    className="group relative flex items-center justify-center focus:outline-none"
                    style={{ width: 40, height: 40, borderRadius: '9999px' }}
                  >
                    {/* Tooltip */}
                    <span
                      className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-[#0A0A0E] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      {link.label}
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A0A0E]" />
                    </span>

                    {/* Icon — sits above the active background blob */}
                    <motion.span
                      className="relative z-10"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85, rotate: -6 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      style={{ color: isActive ? '#000000' : 'rgb(156,163,175)' }}
                    >
                      <Icon className="h-[15px] w-[15px]" />
                    </motion.span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll progress track */}
        <div className="absolute -bottom-2 left-5 right-5 h-[2px] rounded-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress * 100}%`, boxShadow: '0 0 8px rgba(255,255,255,0.85)' }}
            transition={{ ease: 'linear', duration: 0.08 }}
          />
        </div>
      </div>

      {/* 3. Right Column: holds theme toggle and hire me, aligned to left edge next to capsule */}
      <div className="flex-1 hidden sm:flex justify-start pl-4 pointer-events-auto gap-2.5">
        <ThemeToggle />
        <a
          href="#contact"
          className="group inline-flex h-[36px] items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.65)]"
        >
          Hire me
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>

    </div>
  </div>,
  document.documentElement,
);
}

export function Navbar() {
  const activeId = useScrollSpy(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [theme] = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top Header Bar - visible ONLY on mobile (< sm) */}
      <header
        className={cn(
          'fixed inset-x-0 z-40 px-4 pointer-events-none transition-all duration-500 sm:hidden',
          scrolled ? 'top-3' : 'top-6',
        )}
      >
        <div className="mx-auto flex items-center justify-between pointer-events-auto">
          <a
            href="#home"
            className={cn(
              'group inline-flex items-center justify-center rounded-2xl border p-2 backdrop-blur-xl shadow-lg transition-all duration-300',
              scrolled
                ? 'border-white/25 bg-[#05050A]/95 shadow-[0_0_20px_rgba(255,255,255,0.12)]'
                : 'border-white/10 bg-[#08080C]/80',
              'hover:border-white/35 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)]',
            )}
            aria-label="Go to top"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-transform duration-300 group-hover:scale-105">
              <span className="font-display text-xs font-black tracking-wider">JM</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="group inline-flex h-[36px] items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.65)]"
            >
              Hire me
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </header>

      <CapsuleNav activeId={activeId} />

      <span hidden data-theme={theme} />
    </>
  );
}