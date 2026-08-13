import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getIcon } from '@/utils/icons';

const codeLines = [
  { text: 'const', color: 'text-zinc-400 font-bold' },
  { text: ' developer = {', color: 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' },
  { text: '\n  name: ', color: 'text-zinc-400' },
  { text: '"Jean Marc Aguilar"', color: 'text-emerald-400' },
  { text: ',\n  role: ', color: 'text-zinc-400' },
  { text: '"Full Stack Developer"', color: 'text-emerald-400' },
  { text: ',\n  skills: [', color: 'text-zinc-400' },
  { text: '\n    "React", "TypeScript", "Node.js"', color: 'text-amber-300' },
  { text: '\n    "Next.js", "Tailwind CSS", "Python"', color: 'text-amber-300' },
  { text: '\n  ],\n  passion: ', color: 'text-zinc-400' },
  { text: '"Building stunning web apps"', color: 'text-emerald-400' },
  { text: ',\n  status: ', color: 'text-zinc-400' },
  { text: '"Available for hire"', color: 'text-emerald-400' },
  { text: '\n};', color: 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' },
];

export function HeroAvatar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ReactIcon = getIcon('FaReact');
  const TailwindIcon = getIcon('SiTailwindcss');
  const NodeIcon = getIcon('FaNodeJs');

  return (
    <div className="relative mx-auto flex w-full max-w-[600px] items-center justify-center scale-95 sm:scale-100 py-10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        {mounted && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-[40%] blur-[90px]"
            />
            <motion.div
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-32 h-32 bg-white/15 rounded-full blur-[50px]"
            />
            <motion.div
              animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-[60px]"
            />
          </>
        )}
      </div>

      {/* Main Code Window */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10, rotateY: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformPerspective: 1000 }}
        className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/20 bg-[#09090C]/90 backdrop-blur-2xl shadow-[0_0_30px_0_rgba(255,255,255,0.12)]"
      >
        {/* Window Header */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 text-center font-mono text-xs font-medium text-gray-400">
            developer.ts
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 font-mono text-sm sm:text-[15px] leading-relaxed text-left overflow-x-auto min-h-[280px]">
          {mounted && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
            >
              {codeLines.map((line, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, display: 'none' },
                    visible: { opacity: 1, display: 'inline' }
                  }}
                  className={line.color + " whitespace-pre"}
                >
                  {line.text}
                </motion.span>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-2.5 h-4 sm:h-4 ml-1 -mb-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
              />
            </motion.div>
          )}
        </div>

        {/* Subtle bottom gradient reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent dark:from-white/5 pointer-events-none" />
      </motion.div>

      {/* Floating Elements / Icons outside the window */}
      {mounted && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [-10, 10, -10], rotate: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.8 },
              scale: { duration: 0.5, delay: 0.8, type: "spring" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -right-4 md:-right-8 top-16 p-3 rounded-2xl bg-white/70 dark:bg-[#1e293b]/80 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-center text-[#61DAFB]"
          >
            <ReactIcon className="w-8 h-8 opacity-90" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [10, -10, 10], rotate: [0, 5, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 1.1 },
              scale: { duration: 0.5, delay: 1.1, type: "spring" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
            className="absolute -left-2 md:-left-6 bottom-24 p-3 rounded-2xl bg-white/70 dark:bg-[#1e293b]/80 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-center text-[#339933]"
          >
            <NodeIcon className="w-7 h-7 opacity-90" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [-8, 8, -8], rotate: [10, -10, 10] }}
            transition={{
              opacity: { duration: 0.5, delay: 1.4 },
              scale: { duration: 0.5, delay: 1.4, type: "spring" },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className="absolute right-8 -bottom-4 p-2.5 rounded-2xl bg-white/70 dark:bg-[#1e293b]/80 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-center text-[#06B6D4]"
          >
            <TailwindIcon className="w-6 h-6 opacity-90" />
          </motion.div>
        </>
      )}
    </div>
  );
}

