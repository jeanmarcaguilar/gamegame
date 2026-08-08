import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import { Avatar } from '@/components/Avatar';
import { personalInfo, stats } from '@/constants/personal';
import { fadeUp, staggerContainer } from '@/animations/variants';

export function About() {
  return (
    <section id="about" className="relative min-h-screen py-12 sm:py-16 lg:py-20 scroll-mt-24 sm:scroll-mt-28 flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-40 lg:-mt-48">
        <SectionTitle
          eyebrow="About"
          title="A bit about me"
        />

        <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Photo — compact, side-by-side on lg+ */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-4"
          >
            <div className="relative mx-auto w-full max-w-xs lg:max-w-none">
              <FlippableProfileCard />
              <div className="absolute -inset-x-2 bottom-3 mx-auto flex w-fit justify-center">
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-3 py-1 text-xs text-text-muted backdrop-blur">
                  IT Graduate · Class of 2026
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bio — fills the rest, single column of tight cards */}
          <motion.div
            variants={staggerContainer(0.08, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-8"
          >
            <motion.h3
              variants={fadeUp}
              className="font-display text-xl font-bold leading-tight tracking-tight text-text sm:text-2xl lg:text-3xl text-balance"
            >
              {personalInfo.tagline}
            </motion.h3>

            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base text-pretty font-medium"
            >
              Building Modern, Reliable, and User-Focused Web Applications.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base text-pretty"
            >
              I&apos;m an Information Technology graduate with a strong foundation in web
              development and a passion for creating clean, responsive, and user-friendly
              applications. I enjoy turning ideas into practical digital solutions by
              combining intuitive front-end design with reliable back-end development.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base text-pretty"
            >
              My experience includes working with modern web technologies such as HTML, CSS,
              JavaScript, React, PHP, MySQL, and RESTful APIs. Through academic projects and
              continuous self-learning, I&apos;ve developed a solid understanding of full-stack
              development, software design principles, and writing clean, maintainable code.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base text-pretty"
            >
              As I begin my professional career, I&apos;m committed to continuously improving my
              technical skills, learning new technologies, and contributing to meaningful
              projects that create real value. My goal is to grow as a Full-Stack Developer
              while building software that is scalable, efficient, and delivers an excellent
              user experience.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <Detail label="Education" body="BS Information Technology — 2022 to present" />
              <Detail label="Career goal" body="Junior Full Stack role, then product engineering" />
              <Detail label="Currently learning" body="TypeScript, distributed systems, Web3" />
              <Detail label="Passions" body="Clean architecture, mentorship, side projects" />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats — always rendered, nothing to jump to here. */}
        <div
          id="about-stats"
          className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4"
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Detail({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass-soft)] p-3.5">
      <div className="text-[10px] uppercase tracking-[0.16em] text-primary-accent">{label}</div>
      <p className="mt-0.5 text-sm text-text">{body}</p>
    </div>
  );
}

function FlippableProfileCard() {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  // Smooth 3D flip — spring dampens the snap so it eases into rest.
  // Respects prefers-reduced-motion by snapping to the end state.
  const flipTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 70, damping: 18, mass: 0.9 };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Click toggles for touch users; keyboard (Enter/Space) toggles too.
      onClick={() => setHovered((h) => !h)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setHovered((h) => !h);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={hovered ? 'Show profile picture' : 'Show animated avatar'}
      aria-pressed={hovered}
      className="block w-full cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <div
        className="gradient-border overflow-hidden rounded-3xl p-[2px]"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: hovered ? 180 : 0 }}
          transition={flipTransition}
        >
          {/* Front face — static profile picture (default) */}
          <div
            className="aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-bg-secondary"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <img
              src="/profile.jpg"
              alt="Profile picture of Jean Marc Aguilar"
              className="h-full w-full object-cover object-[center_15%]"
              loading="lazy"
              draggable={false}
            />
          </div>

          {/* Back face — animated avatar (revealed on hover) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[22px] bg-bg-secondary"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Avatar kind="image" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
