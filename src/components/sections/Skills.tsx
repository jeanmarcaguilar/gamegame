import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { SkillsGlobe } from '@/components/SkillsGlobe';
import { globeSkills } from '@/constants/skills';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';
import {
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
} from '@/animations/variants';

// ----------------------------------------------------------------
// Left-column category data.
// Icons are sourced from globeSkills so every chip resolves through
// the existing icon map — no new icon imports are introduced.
// ----------------------------------------------------------------
interface CategoryItemData {
  title: string;
  description: string;
  /** Icon key from src/utils/icons.ts — picked from the matching globe skill. */
  iconKey: string;
  count: number;
}

const CATEGORY_ITEMS: CategoryItemData[] = [
  {
    title: 'Frontend',
    description: 'Building responsive and interactive user interfaces.',
    iconKey: 'FaReact',
    count: globeSkills.filter((s) => s.category === 'Frontend').length,
  },
  {
    title: 'Backend',
    description: 'Creating robust server-side logic and RESTful APIs.',
    iconKey: 'FaNodeJs',
    count:
      globeSkills.filter((s) => s.category === 'Backend').length +
      globeSkills.filter((s) => s.category === 'Programming').length,
  },
  {
    title: 'Database',
    description: 'Designing and managing efficient data structures.',
    iconKey: 'SiMysql',
    count: globeSkills.filter((s) => s.category === 'Database').length,
  },
  {
    title: 'Tools & Others',
    description: 'Utilizing modern tools to streamline development.',
    iconKey: 'FaGitAlt',
    count: globeSkills.filter((s) => s.category === 'Tools').length,
  },
];

// ----------------------------------------------------------------
// Right-column info tiles. All data is static — they describe the
// developer at a glance without competing with the globe.
// ----------------------------------------------------------------
interface InfoTileData {
  big: string;
  title: string;
  body: string;
}

const INFO_TILES: InfoTileData[] = [
  {
    big: '12+',
    title: 'Technologies',
    body: 'Used across projects',
  },
  {
    big: 'Full Stack',
    title: 'End-to-end development',
    body: 'experience',
  },
  {
    big: 'Always Learning',
    title: 'Exploring new tools',
    body: 'and improving every day',
  },
];

// ----------------------------------------------------------------
// Small reusable bits
// ----------------------------------------------------------------

/** Vertical list item on the LEFT. Lightweight card with an icon,
 *  title, description and a thin connector pointing toward the
 *  globe area. Kept small on purpose — the globe is the focus. */
function CategoryItem({
  item,
  isLast,
}: {
  item: CategoryItemData;
  isLast: boolean;
}) {
  const Icon = getIcon(item.iconKey);
  return (
    <motion.li
      variants={slideInLeft}
      className="group relative flex gap-3 pb-5 last:pb-0"
    >
      {/* Icon column — connector line runs down the right edge of
          the icon, ending in a small dot that "points" at the globe. */}
      <div className="relative flex w-9 shrink-0 flex-col items-center">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            'border border-white/10 bg-white/[0.04] text-primary-accent',
            'transition-all duration-300',
            'group-hover:border-primary-accent/40 group-hover:bg-primary-accent/10 group-hover:shadow-[0_0_20px_-4px_rgba(96,165,250,0.45)]',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        {!isLast && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-9 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-gradient-to-b from-white/15 via-white/8 to-transparent"
          />
        )}
      </div>

      {/* Text column */}
      <div className="min-w-0 flex-1 pt-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-sm font-semibold tracking-tight text-text">
            {item.title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted/70">
            {String(item.count).padStart(2, '0')}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-text-muted text-pretty">
          {item.description}
        </p>
      </div>
    </motion.li>
  );
}

/** Small glass card on the RIGHT. Big label, small body. */
function InfoTile({ tile }: { tile: InfoTileData }) {
  return (
    <motion.div
      variants={slideInRight}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'border border-white/[0.08] bg-white/[0.025]',
        'p-4 backdrop-blur-sm',
        'transition-colors duration-300',
        'hover:border-primary-accent/25 hover:bg-white/[0.04]',
      )}
    >
      {/* Subtle blue accent gradient — top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary-accent/15 blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="font-display text-xl font-bold leading-none tracking-tight text-text sm:text-2xl">
          {tile.big}
        </div>
        <div className="mt-2 text-sm font-semibold text-text/85">
          {tile.title}
        </div>
        <div className="mt-0.5 text-[12px] leading-relaxed text-text-muted text-pretty">
          {tile.body}
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Main section
// ----------------------------------------------------------------

export function Skills() {
  // Stable hook — kept for parity with the original implementation in
  // case category filtering is reintroduced later.
  const filteredSkills = useMemo(() => globeSkills, []);

  // Section chrome wrappers — render at the top so they can be reused
  // both inside the 3-col grid and the chips row.
  const headerChrome = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-4 flex flex-col items-center text-center sm:mb-6"
    >
      {/* Eyebrow — mirrors the existing SectionTitle eyebrow style */}
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-accent">
        <span className="h-px w-6 bg-primary/60" />
        Skills
        <span className="h-px w-6 bg-primary/60" />
      </div>

      {/* Title */}
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl md:text-5xl text-balance">
        Skills I work with
      </h2>

      {/* Subtitle */}
      <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg text-pretty">
        A living snapshot of the technologies I reach for when building
        modern, reliable products.
      </p>
    </motion.div>
  );

  const globeCard = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative mx-auto w-full"
    >
      {/* Bare globe — no container, border, HUD ticks or corner labels.
          Just the canvas with a fixed height so the 3D scene has room
          to render. The Three.js component itself is untouched. */}
      <div
        className={cn(
          'relative mx-auto w-full',
          'h-[480px] sm:h-[560px] lg:h-[660px] xl:h-[740px]',
        )}
      >
        <SkillsGlobe skills={filteredSkills} />
      </div>
    </motion.div>
  );

  const leftColumn = (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="flex h-full flex-col justify-center"
    >
      <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-text-muted/70">
        <span className="h-1 w-1 rounded-full bg-primary-accent" />
        Categories
      </div>
      <ul className="space-y-0">
        {CATEGORY_ITEMS.map((item, i) => (
          <CategoryItem
            key={item.title}
            item={item}
            isLast={i === CATEGORY_ITEMS.length - 1}
          />
        ))}
      </ul>
    </motion.div>
  );

  const rightColumn = (
    <motion.div
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="flex h-full flex-col justify-center gap-3"
    >
      <div className="mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-text-muted/70">
        <span className="h-1 w-1 rounded-full bg-primary-accent" />
        At a glance
      </div>
      {INFO_TILES.map((tile) => (
        <InfoTile key={tile.title} tile={tile} />
      ))}
    </motion.div>
  );

  return (
    <section
      id="skills"
      aria-label="Skills"
      className="relative flex w-full items-start justify-center overflow-hidden pb-10 sm:pb-12 lg:pb-14 scroll-mt-[2vh] sm:scroll-mt-[3vh] lg:scroll-mt-[4vh]"
    >
      {/* Container — 3-col on lg, with the globe taking the dominant
          center column. On mobile everything stacks vertically. */}
      <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {headerChrome}

        {/* MOBILE/TABLET order:
              1. Globe (centerpiece first on small screens)
              2. Categories
              3. Info tiles
            DESKTOP order:
              1. Globe centered between two columns                  */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4 xl:gap-6">
          {/* Left — categories. Hidden on mobile first, shown after
              globe via the order-* utilities below. */}
          <div className="order-3 lg:order-1 lg:col-span-2 xl:col-span-2">
            {leftColumn}
          </div>

          {/* Center — the globe. Always first on mobile. Much wider
              column so the canvas can stretch further across the page. */}
          <div className="order-1 lg:order-2 lg:col-span-8 xl:col-span-8">
            {globeCard}
          </div>

          {/* Right — info tiles. Second on mobile. */}
          <div className="order-2 lg:order-3 lg:col-span-2 xl:col-span-2">
            {rightColumn}
          </div>
        </div>

        </div>
    </section>
  );
}
