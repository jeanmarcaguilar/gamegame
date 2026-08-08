import { useEffect, useState } from 'react';

/**
 * Cycles through an array of strings, typing and erasing each one
 * with a small pause between.
 */
export function useTypingEffect(
  words: readonly string[],
  typeSpeed = 80,
  eraseSpeed = 45,
  pause = 1400,
) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[wordIndex % words.length];

    const update = () => {
      if (!isDeleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setIsDeleting(true), pause);
          return;
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setIsDeleting(false);
          setWordIndex((i) => i + 1);
          return;
        }
      }
    };

    const delay = isDeleting ? eraseSpeed : typeSpeed;
    const timer = setTimeout(update, delay);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typeSpeed, eraseSpeed, pause]);

  return text;
}
