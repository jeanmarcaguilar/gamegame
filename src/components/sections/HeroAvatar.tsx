import { Avatar } from '@/components/Avatar';

/**
 * Minimal right-side avatar for the Hero.
 * Just the avatar inside a simple circle frame with a soft glow.
 */
export function HeroAvatar() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      {/* Soft radial halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 -z-10 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl"
      />

      {/* Avatar — simple circle frame */}
      <div className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-[var(--color-border-strong)]">
        <Avatar />
      </div>
    </div>
  );
}
