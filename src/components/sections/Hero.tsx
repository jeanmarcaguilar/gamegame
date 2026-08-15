import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { FaDownload, FaPaperPlane, FaFolderOpen } from 'react-icons/fa';
import { LinkButton } from '@/components/Button';
import { HeroAvatar } from '@/components/sections/HeroAvatar';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { personalInfo, typingRoles } from '@/constants/personal';
import { fadeUp, staggerContainer } from '@/animations/variants';
import TypewriterText from '@/components/TypewriterText';
import Spline from '@splinetool/react-spline';

export function Hero() {
  const typed = useTypingEffect(typingRoles);
  const orbRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

  // Smooth cursor interaction with Spline scene
  useEffect(() => {
    let targetX = 0.5;
    let targetY = 0.5;
    let targetDistance = 0;
    let currentX = 0.5;
    let currentY = 0.5;
    let currentDistance = 0;
    let animationFrameId: number | null = null;
    let isTracking = true;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const tick = () => {
      if (!isTracking) return;

      const lerpFactor = 0.06;
      currentX = lerp(currentX, targetX, lerpFactor);
      currentY = lerp(currentY, targetY, lerpFactor);
      currentDistance = lerp(currentDistance, targetDistance, lerpFactor);

      try {
        if (splineRef.current && splineRef.current.setVariable) {
          splineRef.current.setVariable('cursorDistance', currentDistance);
          splineRef.current.setVariable('cursorX', currentX);
          splineRef.current.setVariable('cursorY', currentY);
        }
      } catch {
        /* scene doesn't expose variables — safely ignored */
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const distanceX = Math.abs(e.clientX - centerX) / centerX;
      const distanceY = Math.abs(e.clientY - centerY) / centerY;

      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
      targetDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    };

    const handleLoad = () => {
      if (splineRef.current && splineRef.current.setVariable) {
        try {
          splineRef.current.setVariable('cursorDistance', 0);
          splineRef.current.setVariable('cursorX', 0.5);
          splineRef.current.setVariable('cursorY', 0.5);
        } catch {
          /* scene doesn't expose variables */
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    if (splineRef.current) {
      splineRef.current.addEventListener('load', handleLoad);
    }

    return () => {
      isTracking = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (splineRef.current) {
        splineRef.current.removeEventListener('load', handleLoad);
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Smooth GSAP parallax for Hero background
  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Smooth fade out of ImageBox when scrolling past Hero
  useEffect(() => {
    const el = imageBoxRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'center top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen pt-28 pb-10 scroll-mt-0 flex items-center transition-colors duration-500"
    >
      {/* Spline 3D background — hardware accelerated container */}
      <div
        ref={imageBoxRef}
        className="absolute inset-0 z-[5] h-screen pointer-events-auto"
        style={{ willChange: 'opacity, transform', transform: 'translate3d(0,0,0)' }}
      >
        <div
          ref={orbRef}
          className="h-full w-full"
          style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
        >
          <Spline
            ref={splineRef}
            scene="https://prod.spline.design/si0FoV7XZ1XjbCzK/scene.splinecode"
            style={{ width: '100%', height: '100%', opacity: 1 }}
          />
        </div>
        {/* Hide Spline footer */}
        <style>{`
          div[class*="spline"] > div:last-child {
            display: none !important;
          }
          a[href*="spline.design"] {
            display: none !important;
          }
        `}</style>
        {/* Gradient fade at bottom to blend seamlessly into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
      </div>


      <div className="relative z-10 mx-auto grid max-w-[1400px] w-full grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">

        {/* Left — text */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mb-2"
          >
            HELLO, I'M
          </motion.p>

          {/* Hero Name */}
          <motion.div
            variants={fadeUp}
            className="mb-2"
          >
            <TypewriterText
              font={{
                fontFamily: "font-display",
                fontWeight: 900,
                fontSize: "clamp(48px, 5vw, 80px)",
                textAlign: "left",
                lineHeight: "1.1",
                letterSpacing: "-0.02em"
              }}
              cursorColor="#FFFFFF"
              cursorBorderColor="rgba(255,255,255,0.5)"
              cursorWidth={6}
              cursorHeight={67}
              deletingSpeed={75}
              style={{
                color: "#FFFFFF",
                textShadow: "0 0 25px rgba(255,255,255,0.7)"
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            variants={fadeUp}
            className="mt-6 font-display text-[15px] font-medium text-gray-300 sm:text-base"
          >
            IT Graduate | Web Developer <span className="mx-1 text-white/60">•</span> Aspiring Full Stack Developer
          </motion.div>

          {/* Typing Role */}
          <motion.div
            variants={fadeUp}
            className="mt-4 flex items-center gap-2 font-display text-lg text-gray-300 sm:text-xl"
            aria-live="polite"
          >
            <span>I'm a</span>
            <span className="relative inline-flex items-center font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
              {typed}
              <span
                aria-hidden
                className="ml-1 inline-block h-[1.1em] w-[2px] animate-pulse bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
              />
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[480px] text-sm leading-relaxed text-gray-400 sm:text-[15px] text-pretty"
          >
            Building modern, reliable, and user-focused web applications. I specialize in full-stack development, enjoy solving real-world problems through technology, and continuously improve my skills to build clean, scalable, and maintainable software.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <LinkButton
              href={personalInfo.resumeUrl}
              variant="primary"
              size="lg"
              icon={<FaDownload className="h-3.5 w-3.5" />}
              external
              className="bg-white hover:bg-neutral-200 text-black border-none shadow-[0_0_25px_rgba(255,255,255,0.4)] rounded-xl py-3 px-6 font-bold"
            >
              Download Resume
            </LinkButton>
            <LinkButton
              href="#projects"
              variant="outline"
              size="lg"
              icon={<FaFolderOpen className="h-3.5 w-3.5" />}
              className="bg-[#121215] text-gray-200 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)] rounded-xl py-3 px-6 hover:bg-white/10 hover:border-white/30"
            >
              View Projects
            </LinkButton>
            <LinkButton
              href="#contact"
              variant="outline"
              size="lg"
              icon={<FaPaperPlane className="h-3.5 w-3.5" />}
              className="bg-[#121215] text-gray-200 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)] rounded-xl py-3 px-6 hover:bg-white/10 hover:border-white/30"
            >
              Contact Me
            </LinkButton>
          </motion.div>

        </motion.div>

        {/* Right — 3D composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end"
        >
          <HeroAvatar />
        </motion.div>
      </div>
    </section>
  );
}