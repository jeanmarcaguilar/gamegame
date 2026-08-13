import { motion } from 'framer-motion';
import { TimelineItem } from '@/components/Timeline';
import { experiences } from '@/constants/experience';
import { fadeUp } from '@/animations/variants';

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Experience</span>
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl text-balance"
          >
            Where I&apos;ve <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">been</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-400 text-pretty"
          >
            A timeline of the work, learning, and recognition that&apos;s shaped how I build today.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative mt-20">
          {/* Vertical line container */}
          <div className="absolute left-[100px] md:left-[160px] top-6 bottom-0 w-px bg-white/10" />
          
          <ul className="space-y-12">
            {experiences.map((entry, i) => (
              <TimelineItem key={entry.id} entry={entry} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
