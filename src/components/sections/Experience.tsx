import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/SectionTitle';
import { TimelineItem } from '@/components/Timeline';
import { experiences } from '@/constants/experience';

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Experience"
          title="Where I've been"
          description="A timeline of the work, learning, and recognition that's shaped how I build today."
        />

        <div className="relative mt-16">
          {/* Center line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top' }}
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:block"
          />

          <ul className="space-y-10 md:space-y-14">
            {experiences.map((entry, i) => (
              <TimelineItem key={entry.id} entry={entry} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
