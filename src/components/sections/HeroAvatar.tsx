import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getIcon } from '@/utils/icons';

// Each entry = one rendered line; tokens = colored segments
type Token = { text: string; color: string };
const codeLines: Token[][] = [
  // line 1 — comment
  [{ text: '// 🚀  jean-marc.aguilar.ts', color: 'text-zinc-500 italic' }],
  // line 2 — blank
  [{ text: '', color: '' }],
  // line 3 — import
  [
    { text: 'import', color: 'text-purple-400 font-semibold' },
    { text: ' type ', color: 'text-white' },
    { text: '{ Developer }', color: 'text-cyan-300' },
    { text: ' from ', color: 'text-white' },
    { text: "'@/types'", color: 'text-amber-300' },
    { text: ';', color: 'text-zinc-500' },
  ],
  // line 4 — blank
  [{ text: '', color: '' }],
  // line 5 — interface
  [
    { text: 'interface ', color: 'text-purple-400 font-semibold' },
    { text: 'Profile ', color: 'text-cyan-300 font-semibold' },
    { text: 'extends ', color: 'text-purple-400 font-semibold' },
    { text: 'Developer', color: 'text-cyan-300' },
    { text: ' {', color: 'text-zinc-300' },
  ],
  // line 6
  [
    { text: '  passion', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: 'string', color: 'text-cyan-400' },
    { text: ';', color: 'text-zinc-500' },
  ],
  // line 7
  [
    { text: '  status', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: "'open' | 'hired'", color: 'text-cyan-400' },
    { text: ';', color: 'text-zinc-500' },
  ],
  // line 8
  [{ text: '}', color: 'text-zinc-300' }],
  // line 9 — blank
  [{ text: '', color: '' }],
  // line 10 — const declaration
  [
    { text: 'const ', color: 'text-purple-400 font-semibold' },
    { text: 'me', color: 'text-white font-semibold' },
    { text: ': ', color: 'text-zinc-400' },
    { text: 'Profile', color: 'text-cyan-300' },
    { text: ' = {', color: 'text-zinc-300' },
  ],
  // line 11
  [
    { text: '  name', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: '"Jean Marc Aguilar"', color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
  ],
  // line 12
  [
    { text: '  role', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: '"Full Stack Developer"', color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
  ],
  // line 13
  [
    { text: '  stack', color: 'text-sky-300' },
    { text: ': [', color: 'text-zinc-400' },
    { text: '"React"', color: 'text-amber-300' },
    { text: ', ', color: 'text-zinc-500' },
    { text: '"Next.js"', color: 'text-amber-300' },
    { text: ', ', color: 'text-zinc-500' },
    { text: '"TypeScript"', color: 'text-amber-300' },
    { text: '],', color: 'text-zinc-400' },
  ],
  // line 14
  [
    { text: '  backend', color: 'text-sky-300' },
    { text: ': [', color: 'text-zinc-400' },
    { text: '"Node.js"', color: 'text-amber-300' },
    { text: ', ', color: 'text-zinc-500' },
    { text: '"PHP"', color: 'text-amber-300' },
    { text: ', ', color: 'text-zinc-500' },
    { text: '"Python"', color: 'text-amber-300' },
    { text: '],', color: 'text-zinc-400' },
  ],
  // line 15
  [
    { text: '  passion', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: '"Crafting stunning web apps ✨"', color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
  ],
  // line 16
  [
    { text: '  status', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: "'open'", color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
    { text: '  // 🟢 hire me!', color: 'text-zinc-500 italic' },
  ],
  // line 17
  [{ text: '};', color: 'text-zinc-300' }],
  // line 18 — blank
  [{ text: '', color: '' }],
  // line 19 — export
  [
    { text: 'export default ', color: 'text-purple-400 font-semibold' },
    { text: 'me', color: 'text-white' },
    { text: ';', color: 'text-zinc-500' },
  ],
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
        className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/10 bg-transparent backdrop-blur-xl shadow-[0_0_40px_0_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {/* Window Header */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
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
        <div className="p-4 font-mono text-[12px] sm:text-[13px] leading-[1.75] text-left overflow-x-auto min-h-[280px]">
          {mounted && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 }
                }
              }}
            >
              {codeLines.map((tokens, lineIdx) => (
                <motion.div
                  key={lineIdx}
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } }
                  }}
                  className="flex items-start"
                >
                  {/* Gutter line number */}
                  <span className="select-none w-7 shrink-0 text-right pr-3 text-zinc-600 text-[11px] leading-[1.75]">
                    {lineIdx + 1}
                  </span>
                  {/* Tokens */}
                  <span className="flex flex-wrap">
                    {tokens.map((tok, tokIdx) => (
                      <span key={tokIdx} className={tok.color + ' whitespace-pre'}>
                        {tok.text}
                      </span>
                    ))}
                    {/* Blinking cursor on last line */}
                    {lineIdx === codeLines.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-[2px] h-[1em] ml-0.5 translate-y-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                      />
                    )}
                  </span>
                </motion.div>
              ))}
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

