import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { projects } from '@/constants/projects';
import type { Project } from '@/constants/projects';
import { fadeUp } from '@/animations/variants';

// Spline is loaded lazily and only once the section actually enters the
// viewport. The page was previously mounting a full WebGL context behind
// the project grid on first paint — combined with the Hero Spline that's
// two GPU-heavy contexts running at once, which made scroll into the
// Projects section visibly hitch. Deferring until the section is visible
// means the page has only one Spline scene during the initial scroll.
const Spline = lazy(() => import('@splinetool/react-spline'));

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [loadSpline, setLoadSpline] = useState(false);

  // Take first 4 projects for a 2x2 grid if we want to match the image exactly,
  // or just show all. We'll show all and let them wrap.
  const displayProjects = projects.slice(0, 4);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setLoadSpline(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadSpline(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden min-h-screen py-24 sm:py-28 lg:py-36"
    >
      {/* Spline 3D Background — oversized canvas cropped to hide watermark corner.
          Lazy: the actual <Spline/> component is only mounted once the
          section scrolls near the viewport (see the IntersectionObserver
          above). Until then we render a lightweight CSS gradient so the
          section's vertical space is reserved and there's no layout jump. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {loadSpline ? (
          <Suspense fallback={null}>
            <div
              className="absolute flex items-center justify-center"
              style={{
                top: '-2%',
                left: '-2%',
                width: '106%',
                height: '112%',
              }}
            >
              <Spline
                scene="https://prod.spline.design/1svVMR5yatbXHB32/scene.splinecode"
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 1,
                  transform: 'scale(1.3)',
                }}
              />
              {/* Hide Spline watermark */}
              <style>{`
                div[class*="spline"] > div:last-child {
                  display: none !important;
                }
                a[href*="spline.design"] {
                  display: none !important;
                }
                .spline-watermark {
                  display: none !important;
                }
                [class*="watermark"] {
                  display: none !important;
                }
                [class*="logo"] {
                  display: none !important;
                }
                .spline__logo {
                  display: none !important;
                }
                .spline-embed-wrapper > div > div:last-child {
                  display: none !important;
                }
              `}</style>
            </div>
          </Suspense>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60rem 40rem at 50% 40%, rgba(255,255,255,0.04), transparent 65%)',
            }}
          />
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Projects</span>
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl text-balance"
          >
            Featured <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">work</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-400 text-pretty"
          >
            A small selection of projects I&apos;ve designed and built — each one taught me
            something about scope, trade-offs, and shipping.
          </motion.p>
        </div>

        {/* Project Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {displayProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={(p) => setOpenProject(p)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <a
            href={projects[0]?.github ? new URL(projects[0].github).origin + '/' : '#'}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
          >
            See more on GitHub
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}