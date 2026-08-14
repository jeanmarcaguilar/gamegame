import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { projects } from '@/constants/projects';
import type { Project } from '@/constants/projects';
import { fadeUp } from '@/animations/variants';
import Spline from '@splinetool/react-spline';

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  // Take first 4 projects for a 2x2 grid if we want to match the image exactly,
  // or just show all. We'll show all and let them wrap.
  const displayProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="relative overflow-hidden min-h-screen py-24 sm:py-28 lg:py-36">
      {/* Spline 3D Background — oversized canvas cropped to hide watermark corner */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
        </div>
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