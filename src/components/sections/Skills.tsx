import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle } from '@/components/SectionTitle';
import { SkillCard } from '@/components/SkillCard';
import { skillCategories } from '@/constants/skills';
import { cn } from '@/utils/cn';

export function Skills() {
  const [active, setActive] = useState(skillCategories[0].title);
  const current = skillCategories.find((c) => c.title === active) ?? skillCategories[0];

  return (
    <section id="skills" className="relative py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Skills"
          title="Tools I work with"
          description="Languages, frameworks, and tools I reach for when solving problems — kept in practice through real projects, not just tutorials."
        />

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {skillCategories.map((category) => {
            const isActive = category.title === active;
            return (
              <button
                key={category.title}
                onClick={() => setActive(category.title)}
                className={cn(
                  'relative inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'border-primary/40 bg-primary/15 text-text shadow-glow'
                    : 'border-[var(--color-border)] bg-[var(--color-glass-soft)] text-text-muted hover:border-[var(--color-border-strong)] hover:text-text',
                )}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <p className="mb-6 text-center text-sm text-text-muted">{current.description}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {current.skills.map((skill, i) => (
                <SkillCard key={skill.name} {...skill} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
