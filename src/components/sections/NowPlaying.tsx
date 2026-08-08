import { motion } from 'framer-motion';
import { SiSpotify } from 'react-icons/si';
import { SectionTitle } from '@/components/SectionTitle';

const SPOTIFY_ALBUM_URL =
  'https://open.spotify.com/album/53SL5EIuJdUG7EBF6u2rdv?si=rz8omjwWS1W6TPW9RzkWjQ';

// Spotify's official embed iframe requires this exact origin form.
// The album id comes from the shared URL above.
const ALBUM_ID = '53SL5EIuJdUG7EBF6u2rdv';
const EMBED_SRC = `https://open.spotify.com/embed/album/${ALBUM_ID}?utm_source=generator&theme=0`;

export function NowPlaying() {
  return (
    <section id="now-playing" className="relative py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Now Playing"
          title="What's on repeat"
          description="A small slice of what I'm listening to right now — pulled straight from Spotify. Hit play and take a listen."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg shadow-black/5 transition-colors duration-300">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-muted px-5 py-3 transition-colors duration-300">
              <div className="flex items-center gap-2 text-sm font-medium text-text">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-accent opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-accent" />
                </span>
                Live from Spotify
              </div>
              <a
                href={SPOTIFY_ALBUM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors duration-300 hover:text-text"
                aria-label="Open album on Spotify"
              >
                <SiSpotify className="h-4 w-4 text-primary-accent" aria-hidden />
                Open in Spotify
              </a>
            </div>

            <iframe
              title="Spotify album player"
              src={EMBED_SRC}
              width="100%"
              height="352"
              style={{ border: 0 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block w-full"
            />
          </div>

          <p className="mt-4 text-center text-xs text-text-muted">
            Tip: change the album by swapping <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text">ALBUM_ID</code> in{' '}
            <code className="rounded bg-surface-muted px-1.5 py-0.5 text-text">src/components/sections/NowPlaying.tsx</code>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
