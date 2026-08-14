import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { FaRegCalendarCheck, FaCubes, FaGraduationCap, FaShoppingCart, FaCar, FaCode } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import type { Project } from '@/constants/projects';
import { cn } from '@/utils/cn';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  index?: number;
}

// Map project ID to a specific theme matching the design
function getThemeInfo(id: string) {
  const baseWhite = {
    color: 'white',
    borderColor: 'border-white/20',
    hoverBorder: 'group-hover:border-white/60',
    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    hoverGlow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]',
    bgGlow: 'bg-white/10',
    iconColor: 'text-white',
    iconBg: 'bg-white/15',
    ringColor: 'border-white/30',
    textColor: 'text-white',
  };

  switch (id) {
    case 'smart-campus-attendance':
      return { ...baseWhite, icon: FaRegCalendarCheck };
    case 'blockchain-ecommerce':
      return { ...baseWhite, icon: FaCubes };
    case 'loan-management':
      return { ...baseWhite, icon: FaGraduationCap };
    case 'parking-management':
    case 'portfolio-website':
    default:
      return {
        ...baseWhite,
        icon: id === 'parking-management' ? FaCar : id === 'portfolio-website' ? FaCode : FaShoppingCart,
      };
  }
}

export function ProjectCard({ project, onOpen, index = 0 }: ProjectCardProps) {
  const theme = getThemeInfo(project.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.1, 0.35),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title} details`}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-3xl bg-[#080b14] border',
        'transition-all duration-500 text-left',
        theme.borderColor,
        theme.hoverBorder,
        theme.glow,
        theme.hoverGlow
      )}
    >
      {/* Graphic Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0a0f1c]">
        {/* Background ambient glow */}
        <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[80%] h-[150%] rounded-[100%] blur-[80px] opacity-30 ${theme.bgGlow}`} />

        {/* Mock UI Composition */}
        <MockUIGraphic theme={theme} badge={project.badge} />

        {/* Fade to bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#080b14] to-transparent" />
      </div>

      {/* Body */}
      <div className="p-4 relative z-10">
        <h3 className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
          {project.title}
        </h3>
        <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-gray-400 text-pretty font-medium">
          {project.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-1">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-300 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-300 backdrop-blur-sm">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              <FaGithub className="h-3 w-3" />
              GitHub
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1 rounded-full border ${theme.borderColor} ${theme.bgGlow} px-2.5 py-1 text-[10px] sm:text-xs font-medium ${theme.textColor} transition-all duration-300 hover:brightness-125`}
            >
              <FaExternalLinkAlt className="h-2.5 w-2.5" />
              Live Demo
            </a>
          )}
          <span className={`ml-auto inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold transition-colors duration-300 ${theme.textColor} group-hover:brightness-125`}>
            View details
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * A composite component that renders the abstract UI seen in the design.
 */
function MockUIGraphic({ theme, badge }: { theme: any, badge?: string }) {
  const Icon = theme.icon;

  return (
    <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-between">
      {/* Top Left Badge */}
      {badge && (
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-gray-300 z-20">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
          {badge}
        </div>
      )}

      {/* Main Glowing Icon Area (Left) */}
      <div className="relative flex items-center justify-center w-[45%] h-full ml-2 sm:ml-4">
        {/* Concentric rings */}
        <div className={`absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full border ${theme.ringColor} opacity-50`} />
        <div className={`absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border ${theme.ringColor} opacity-20`} />

        {/* Core Icon */}
        <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full ${theme.iconBg} border ${theme.ringColor} shadow-[0_0_20px_currentColor] ${theme.textColor}`}>
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>

      {/* Mock Dashboard Area (Right) */}
      <div className="relative w-[50%] h-[70%] bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md shadow-2xl mr-2 overflow-hidden">
        {/* Top Header Mock */}
        <div className="flex items-center justify-between">
          <div className="h-2 w-16 bg-gray-500/50 rounded-full" />
          <div className="h-2 w-8 bg-gray-600/30 rounded-full" />
        </div>

        {/* Middle Stats Mock */}
        <div className="flex gap-3 items-end mt-4">
          <div className={`w-12 h-12 rounded-full border-[3px] ${theme.borderColor} flex items-center justify-center ${theme.textColor} font-bold text-[10px]`}>
            92%
          </div>
          <div className="flex-1 flex items-end gap-1.5 h-12">
            {[40, 70, 45, 90, 60].map((height, i) => (
              <div
                key={i}
                className={`w-full rounded-t-sm ${i === 3 ? theme.iconBg.replace('20', '80') : 'bg-gray-600/30'}`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Bottom List Mock */}
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${i === 1 ? theme.bgGlow.replace('10', '100') : 'bg-red-500'}`} />
                <div className="h-1.5 w-12 bg-gray-500/40 rounded-full" />
              </div>
              <div className="h-1.5 w-6 bg-gray-600/40 rounded-full" />
            </div>
          ))}
        </div>

        {/* Subtle overlay gradient to match the glossy feel */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-xl" />
      </div>
    </div>
  );
}