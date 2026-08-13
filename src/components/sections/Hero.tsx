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

export function Hero() {
  const typed = useTypingEffect(typingRoles);
  const orbRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP parallax
  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Split name for styling
  const nameParts = personalInfo.name.split(' ');
  const lastName = nameParts.pop();
  const firstName = nameParts.join(' ');

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen pt-28 pb-10 scroll-mt-0 flex items-center bg-[var(--color-bg)] transition-colors duration-500"
    >
      {/* Light subtle grid background matching reference */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ 
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)', 
        backgroundSize: '40px 40px' 
      }}></div>

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
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5rem]"
          >
            {firstName} <br />
            <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">{lastName}</span>
          </motion.h1>

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