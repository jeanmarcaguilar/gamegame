import { motion } from 'framer-motion';
import { FaCode, FaBriefcase, FaGraduationCap, FaTrophy } from 'react-icons/fa6';
import type { ExperienceEntry } from '@/constants/experience';

const iconMap: Record<string, any> = {
  Internship: FaBriefcase,
  Freelance: FaCode,
  Academic: FaGraduationCap,
  Achievement: FaTrophy,
};

function getThemeInfo(_type?: string) {
  const baseWhite = {
    color: 'white',
    borderColor: 'border-white/20',
    hoverBorder: 'group-hover:border-white/50',
    bg: 'bg-white/10',
    iconBg: 'bg-white/15',
    textColor: 'text-white',
    dotColor: 'bg-white',
    glow: 'shadow-[0_0_12px_rgba(255,255,255,0.9)]',
  };

  return baseWhite;
}

interface TimelineItemProps {
  entry: ExperienceEntry;
  index: number;
}

export function TimelineItem({ entry, index }: TimelineItemProps) {
  const Icon = iconMap[entry.type] ?? FaBriefcase;
  const theme = getThemeInfo(entry.type);

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full group"
    >
      {/* Left: Date Pill & Connector */}
      <div className="flex w-[100px] md:w-[160px] shrink-0 pt-5 pr-4 justify-end relative">
        <div className="relative flex items-center justify-end w-full">
          <span className="relative z-10 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-medium text-gray-300 backdrop-blur-sm whitespace-nowrap">
            {entry.period}
          </span>
          {/* Horizontal line connector */}
          <div className="absolute right-[-1.5rem] top-1/2 h-px w-6 bg-white/10 -z-0" />
        </div>
      </div>

      {/* Middle: Vertical line overlap & Dot */}
      <div className="relative flex flex-col items-center mt-[1.65rem] shrink-0 w-px">
        <div className={`relative z-20 h-2.5 w-2.5 md:h-3 md:w-3 -ml-[1px] rounded-full ${theme.dotColor} ${theme.textColor} ${theme.glow} ring-4 ring-[#080b14] transition-transform duration-300 group-hover:scale-125`} />
      </div>

      {/* Right: Themed Card */}
      <div className="ml-6 md:ml-10 flex-1">
        <div className={`relative overflow-hidden rounded-2xl bg-[#0a0f1c] border ${theme.borderColor} ${theme.hoverBorder} p-6 md:p-8 transition-colors duration-500`}>
          
          {/* Ambient background glow inside the card */}
          <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${theme.bg}`} />
          {/* Subtle dot pattern background on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

          <div className="relative z-10 flex items-start gap-4 md:gap-5">
            {/* Icon Box */}
            <div className={`flex shrink-0 h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl ${theme.iconBg} border ${theme.borderColor} ${theme.textColor}`}>
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </div>

            {/* Header Text */}
            <div className="flex-1 min-w-0 pt-0.5">
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${theme.textColor}`}>
                {entry.type === 'Academic' ? 'Academic Projects' : entry.type}
              </span>
              <h3 className="mt-1 font-display text-lg md:text-xl font-bold leading-tight text-white">
                {entry.title}
              </h3>
              <p className="mt-1 text-xs md:text-sm text-gray-400">
                {entry.organization}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 border-t border-white/5 pt-5">
            <p className="text-sm leading-relaxed text-gray-300">
              {entry.description}
            </p>

            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {entry.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-xs md:text-sm text-gray-400 leading-relaxed">
                    <span className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${theme.dotColor}`} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}
