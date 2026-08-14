import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getIcon } from '@/utils/icons';

const TYPING_SPEED_MS = 30;   // ms per character
const PAUSE_AFTER_MS = 2000; // pause before looping

type Token = { text: string; color: string };
const codeLines: Token[][] = [
  [{ text: '// 🚀  jean-marc.aguilar.ts', color: 'text-zinc-500 italic' }],
  [{ text: '', color: '' }],
  [
    { text: 'import', color: 'text-purple-400 font-semibold' },
    { text: ' type ', color: 'text-white' },
    { text: '{ Developer }', color: 'text-cyan-300' },
    { text: ' from ', color: 'text-white' },
    { text: "'@/types'", color: 'text-amber-300' },
    { text: ';', color: 'text-zinc-500' },
  ],
  [{ text: '', color: '' }],
  [
    { text: 'interface ', color: 'text-purple-400 font-semibold' },
    { text: 'Profile ', color: 'text-cyan-300 font-semibold' },
    { text: 'extends ', color: 'text-purple-400 font-semibold' },
    { text: 'Developer', color: 'text-cyan-300' },
    { text: ' {', color: 'text-zinc-300' },
  ],
  [
    { text: '  passion', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: 'string', color: 'text-cyan-400' },
    { text: ';', color: 'text-zinc-500' },
  ],
  [
    { text: '  status', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: "'open' | 'hired'", color: 'text-cyan-400' },
    { text: ';', color: 'text-zinc-500' },
  ],
  [{ text: '}', color: 'text-zinc-300' }],
  [{ text: '', color: '' }],
  [
    { text: 'const ', color: 'text-purple-400 font-semibold' },
    { text: 'me', color: 'text-white font-semibold' },
    { text: ': ', color: 'text-zinc-400' },
    { text: 'Profile', color: 'text-cyan-300' },
    { text: ' = {', color: 'text-zinc-300' },
  ],
  [
    { text: '  name', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: '"Jean Marc Aguilar"', color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
  ],
  [
    { text: '  role', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: '"Full Stack Developer"', color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
  ],
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
  [
    { text: '  passion', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: '"Crafting stunning web apps ✨"', color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
  ],
  [
    { text: '  status', color: 'text-sky-300' },
    { text: ': ', color: 'text-zinc-400' },
    { text: "'open'", color: 'text-emerald-400' },
    { text: ',', color: 'text-zinc-500' },
    { text: '  // 🟢 hire me!', color: 'text-zinc-500 italic' },
  ],
  [{ text: '};', color: 'text-zinc-300' }],
  [{ text: '', color: '' }],
  [
    { text: 'export default ', color: 'text-purple-400 font-semibold' },
    { text: 'me', color: 'text-white' },
    { text: ';', color: 'text-zinc-500' },
  ],
];

// ── Flatten tokens → individual characters ────────────────────────────────────
type CharToken = { char: string; color: string };

function buildFlatChars(lines: Token[][]): CharToken[] {
  const chars: CharToken[] = [];
  lines.forEach((tokens, li) => {
    tokens.forEach((tok) => {
      for (const c of tok.text) {
        chars.push({ char: c, color: tok.color });
      }
    });
    // newline between lines (not after the last)
    if (li < lines.length - 1) {
      chars.push({ char: '\n', color: '' });
    }
  });
  return chars;
}

const flatChars = buildFlatChars(codeLines);

// ── Group consecutive chars of same color into spans ─────────────────────────
function groupLine(chars: CharToken[]): { text: string; color: string }[] {
  const groups: { text: string; color: string }[] = [];
  for (const ct of chars) {
    const last = groups[groups.length - 1];
    if (last && last.color === ct.color) {
      last.text += ct.char;
    } else {
      groups.push({ text: ct.char, color: ct.color });
    }
  }
  return groups;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function HeroAvatar() {
  const [mounted, setMounted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ReactIcon = getIcon('FaReact');
  const TailwindIcon = getIcon('SiTailwindcss');
  const NodeIcon = getIcon('FaNodeJs');

  useEffect(() => { setMounted(true); }, []);

  // Typing loop
  useEffect(() => {
    if (!mounted) return;

    let isTyping = true;

    function startTyping() {
      // Clear any existing intervals/timeouts
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Reset character count
      setCharCount(0);

      // Small delay to ensure state reset before starting
      timeoutRef.current = setTimeout(() => {
        if (!isTyping) return;

        intervalRef.current = setInterval(() => {
          setCharCount((c) => {
            if (!isTyping) return c;

            if (c >= flatChars.length - 1) {
              // done → pause → restart
              if (intervalRef.current) clearInterval(intervalRef.current);
              timeoutRef.current = setTimeout(startTyping, PAUSE_AFTER_MS);
              return flatChars.length;
            }
            return c + 1;
          });
        }, TYPING_SPEED_MS);
      }, 50);
    }

    startTyping();

    return () => {
      isTyping = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mounted]);

  // Build rendered lines from revealed chars
  const renderedLines = useMemo(() => {
    const lines: CharToken[][] = [[]];
    for (let i = 0; i < Math.min(charCount, flatChars.length); i++) {
      const ct = flatChars[i];
      if (ct.char === '\n') {
        lines.push([]);
      } else {
        lines[lines.length - 1].push(ct);
      }
    }
    return lines;
  }, [charCount]);

  return (
    <div className="relative mx-auto flex w-full max-w-[600px] items-center justify-center scale-95 sm:scale-100 py-10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        {mounted && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-[40%] blur-[90px]"
            />
            <motion.div
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 right-10 w-32 h-32 bg-white/15 rounded-full blur-[50px]"
            />
            <motion.div
              animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
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
            jean-marc.aguilar.ts
          </div>
        </div>

        {/* Code Content — typewriter */}
        <div className="p-4 font-mono text-[12px] sm:text-[13px] leading-[1.75] text-left overflow-x-auto min-h-[320px]">
          {mounted && renderedLines.map((lineChars, lineIdx) => {
            const groups = groupLine(lineChars);
            const isActiveLine = lineIdx === renderedLines.length - 1;
            const lineNo = lineIdx + 1;

            return (
              <div key={lineIdx} className="flex items-start">
                {/* Line number gutter */}
                <span className="select-none w-7 shrink-0 text-right pr-3 text-zinc-600 text-[11px] leading-[1.75]">
                  {lineNo}
                </span>

                {/* Code tokens */}
                <span className="flex-1">
                  {groups.map((g, gi) => (
                    <span key={gi} className={g.color + ' whitespace-pre'}>
                      {g.text}
                    </span>
                  ))}

                  {/* Blinking cursor follows the active (last revealed) line */}
                  {isActiveLine && charCount < flatChars.length && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-[2px] h-[0.9em] align-middle ml-[1px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                    />
                  )}

                  {/* Static cursor after typing finishes */}
                  {isActiveLine && charCount >= flatChars.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-[2px] h-[0.9em] align-middle ml-[1px] bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </motion.div>

      {/* Floating Tech Icons */}
      {mounted && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [-10, 10, -10], rotate: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.8 },
              scale: { duration: 0.5, delay: 0.8, type: 'spring' },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
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
              scale: { duration: 0.5, delay: 1.1, type: 'spring' },
              y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
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
              scale: { duration: 0.5, delay: 1.4, type: 'spring' },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
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
