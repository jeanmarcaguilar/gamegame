import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { projects } from '@/constants/projects';
import type { Project } from '@/constants/projects';
import { fadeUp } from '@/animations/variants';

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  // Take first 4 projects for a 2x2 grid if we want to match the image exactly,
  // or just show all. We'll show all and let them wrap.
  const displayProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="relative py-24 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background Orbits */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-[100%] border-t border-blue-500/20 shadow-[0_-10px_30px_rgba(59,130,246,0.1)]" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[150px] rounded-[100%] border-t border-blue-400/30" />
        {/* Glowing dots on orbits */}
        <div className="absolute top-[21%] left-[30%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.8)]" />
        <div className="absolute top-[28%] right-[35%] h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.8)]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-500 uppercase">Projects</span>
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl text-balance"
          >
            Featured <span className="text-blue-500">work</span>
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
