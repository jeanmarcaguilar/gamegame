import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { FaDownload, FaPaperPlane, FaFolderOpen } from 'react-icons/fa';
import { LinkButton } from '@/components/Button';
import { FloatingShapes } from '@/components/FloatingShapes';
import { HeroAvatar } from '@/components/sections/HeroAvatar';
import { SpotifyNowPlaying } from '@/components/SpotifyNowPlaying';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { useFastScramble } from '@/hooks/useFastScramble';
import { personalInfo, typingRoles } from '@/constants/personal';
import { fadeUp, fadeIn, staggerContainer } from '@/animations/variants';

export function Hero() {
  const typed = useTypingEffect(typingRoles);
  const scrambledName = useFastScramble(personalInfo.name);
  const orbRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP parallax on the floating shapes
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

  return (
    <section
      id="home"
      className="relative overflow-hidden h-screen pt-20 pb-0 scroll-mt-0 flex items-center"
    >
      {/* Ambient backdrop layers */}
      <div className="bg-radial-glow absolute inset-0 -z-10" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div ref={orbRef} className="absolute inset-0 -z-10">
        <FloatingShapes />
      </div>

      <div className="mx-auto grid max-w-6xl w-full grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        {/* Left — text */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8"
        >
          {/* Status chip */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-4 py-2 text-xs font-medium text-text-muted backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Open for opportunities
          </motion.div>

          {/* Spotify Now Playing */}
          <motion.div variants={fadeUp} className="mt-4">
            <SpotifyNowPlaying />
          </motion.div>

          {/* Eyebrow — "Hello, I'm" lifted above the name */}
          <motion.p
            variants={fadeUp}
            className="mt-8 font-display text-sm font-medium uppercase tracking-[0.32em] text-primary-accent sm:text-base"
          >
            Hello, I&apos;m
          </motion.p>

          {/* The hero — name with scramble, big. clamp() keeps it
              inside the column at every viewport without relying on the
              lg breakpoint alone. */}
          <motion.h1
            variants={fadeUp}
            className="mt-2 overflow-hidden font-display text-5xl font-bold leading-[1.05] tracking-tight text-text text-balance"
            style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)' }}
          >
            <span
              className="relative inline-block whitespace-nowrap"
              aria-label={personalInfo.name}
              style={{ width: `${personalInfo.name.length}ch` }}
            >
              {/* Invisible spacer reserves the resolved name's width so
                  scramble frames (binary, hex, etc.) don't shift layout. */}
              <span aria-hidden className="invisible">
                {personalInfo.name}
              </span>
              <span
                aria-hidden
                className="gradient-text absolute inset-0 whitespace-pre"
              >
                {scrambledName}
              </span>
            </span>
          </motion.h1>

          {/* Sub-role + role */}
          <motion.div
            variants={fadeUp}
            className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-base text-text-muted sm:text-lg"
          >
            <span className="font-medium text-text">{personalInfo.subRole}</span>
            <span aria-hidden className="text-text-muted/40">•</span>
            <span className="font-medium text-text">{personalInfo.role}</span>
          </motion.div>

          {/* "I'm a [typing role]" */}
          <motion.div
            variants={fadeUp}
            className="mt-3 flex items-baseline gap-3 font-display text-lg text-primary-accent sm:text-xl"
            aria-live="polite"
          >
            <span className="text-text-muted">I&apos;m a</span>
            <span className="relative inline-flex min-w-[180px] items-baseline font-semibold text-text">
              <span className="relative">
                {typed}
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 inline-block h-5 w-[2px] -translate-y-1/2 animate-pulse bg-primary-accent"
                />
              </span>
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg text-pretty"
          >
            {personalInfo.bio}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <LinkButton
              href={personalInfo.resumeUrl}
              variant="primary"
              size="lg"
              icon={<FaDownload className="h-4 w-4" />}
              external
            >
              Download Resume
            </LinkButton>
            <LinkButton
              href="#projects"
              variant="outline"
              size="lg"
              icon={<FaFolderOpen className="h-4 w-4" />}
            >
              View Projects
            </LinkButton>
            <LinkButton
              href="#contact"
              variant="ghost"
              size="lg"
              icon={<FaPaperPlane className="h-4 w-4" />}
            >
              Contact Me
            </LinkButton>
          </motion.div>

          {/* Status row */}
          <motion.div
            variants={fadeIn}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Available for remote work/onsite/freelance/full-time/junior opportunities.
            </span>
            <span aria-hidden className="hidden h-1 w-px bg-[var(--color-border-strong)] sm:inline-block" />
            <span className="hidden sm:inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              {personalInfo.location}
            </span>
          </motion.div>
        </motion.div>

        {/* Right — avatar composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-4"
        >
          <HeroAvatar />
        </motion.div>
      </div>
    </section>
  );
}