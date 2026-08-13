import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { StatCard } from '@/components/StatCard';
import { Avatar } from '@/components/Avatar';
import { stats } from '@/constants/personal';
import { fadeUp, staggerContainer } from '@/animations/variants';
import { IoSchoolOutline } from 'react-icons/io5';
import { GoGoal } from 'react-icons/go';
import { FaCode, FaHeart } from 'react-icons/fa6';
import { IconType } from 'react-icons';

export function About() {
  return (
    <section id="about" className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 scroll-mt-24 sm:scroll-mt-28 flex flex-col items-center justify-center overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Side: Photo with Glowing Effects */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative lg:col-span-5 flex justify-center"
          >
            {/* Background concentric glowing circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] aspect-square pointer-events-none">
              <div className="absolute inset-0 rounded-full border border-white/10 scale-[1.2]" />
              <div className="absolute inset-8 rounded-full border border-white/20 scale-[1.1]" />
              <div className="absolute inset-16 rounded-full border border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.15)]" />
              {/* Glowing dot on the right side of circles */}
              <div className="absolute top-1/2 right-4 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.9)]" />
            </div>

            {/* Profile Card Container */}
            <div className="relative z-10 w-full max-w-[320px] rounded-3xl p-[1px] bg-gradient-to-b from-white/80 via-white/30 to-white/10 shadow-[0_0_35px_rgba(255,255,255,0.25)]">
              <div className="relative rounded-[23px] overflow-hidden bg-[#0A0A0C]">
                <FlippableProfileCard />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%]">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/70 p-3 backdrop-blur-md shadow-lg">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      <IoSchoolOutline size={14} />
                    </div>
                    <span className="text-xs font-medium text-white">
                      IT Graduate · Class of 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Bio and Cards */}
          <motion.div
            variants={staggerContainer(0.08, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">About</span>
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl text-balance"
            >
              A bit <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">about me</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg sm:text-xl leading-relaxed text-gray-300 font-medium"
            >
              Building clean, modern, and user-focused<br className="hidden sm:block" /> web experiences.
            </motion.p>

            <div className="mt-8 space-y-4 text-sm sm:text-[15px] leading-relaxed text-gray-400/90 text-pretty">
              <motion.p variants={fadeUp}>
                I&apos;m an Information Technology graduate with a strong foundation in web
                development and a passion for creating clean, responsive, and user-friendly
                applications. I enjoy turning ideas into practical digital solutions by
                combining intuitive front-end design with reliable back-end development.
              </motion.p>

              <motion.p variants={fadeUp}>
                My experience includes working with modern technologies such as HTML, CSS,
                JavaScript, React, PHP, MySQL, and RESTful APIs. Through academic projects and
                continuous self-learning, I&apos;ve developed a solid understanding of full-stack
                development, software design principles, and writing clean, maintainable code.
              </motion.p>

              <motion.p variants={fadeUp}>
                As I begin my professional career, I&apos;m committed to continuously improving my
                technical skills, learning new technologies, and contributing to meaningful
                projects that create real value. My goal is to grow as a Full-Stack Developer
                while building software that is scalable, efficient, and delivers an excellent
                user experience.
              </motion.p>
            </div>

            {/* Details Cards */}
            <motion.div
              variants={fadeUp}
              className="mt-10 grid gap-4 sm:grid-cols-2"
            >
              <DetailCard 
                icon={IoSchoolOutline} 
                label="Education" 
                body={"BS Information Technology\n2022 to present"} 
              />
              <DetailCard 
                icon={GoGoal} 
                label="Career Goal" 
                body={"Junior Full Stack role,\nthen product engineering"} 
              />
              <DetailCard 
                icon={FaCode} 
                label="Currently Learning" 
                body={"TypeScript, distributed\nsystems, Web3"} 
              />
              <DetailCard 
                icon={FaHeart} 
                label="Passions" 
                body={"Clean architecture, mentorship,\nside projects"} 
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats — optionally hidden or placed elsewhere depending on exact design. We'll keep them below for now. */}
        <div
          id="about-stats"
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 hidden"
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface DetailCardProps {
  icon: IconType;
  label: string;
  body: string;
  iconColor?: string;
  iconBg?: string;
}

function DetailCard({ icon: Icon, label, body, iconColor = "text-white", iconBg = "bg-white/15 border border-white/20" }: DetailCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#09090C] p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#121216] hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-white mb-1">{label}</div>
        <p className="text-[13px] leading-snug text-gray-300 whitespace-pre-line">{body}</p>
      </div>
    </div>
  );
}

function FlippableProfileCard() {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  // Smooth 3D flip — spring dampens the snap so it eases into rest.
  const flipTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 70, damping: 18, mass: 0.9 };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      className="block w-full cursor-pointer focus:outline-none"
    >
      <div
        className="overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: hovered ? 180 : 0 }}
          transition={flipTransition}
        >
          {/* Front face */}
          <div
            className="aspect-[3/4] w-full overflow-hidden bg-bg-secondary"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <img
              src="/profile.jpg"
              alt="Profile picture of Jean Marc Aguilar"
              className="h-full w-full object-cover object-[center_15%]"
              loading="lazy"
              draggable={false}
            />
            {/* Dark gradient overlay at the bottom for the badge to pop */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 overflow-hidden bg-bg-secondary"
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
