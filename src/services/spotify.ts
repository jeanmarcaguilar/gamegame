/**
 * Spotify Web API client for the Now Playing widget.
 *
 * Auth: PKCE (Authorization Code with Proof Key for Code Exchange).
 *  - No client secret needed — safe to ship to a static site.
 *  - The long-lived refresh token is read from VITE_SPOTIFY_REFRESH_TOKEN.
 *    Get one by opening scripts/spotify-auth.html once in your browser.
 *  - Access tokens are exchanged on demand and cached in memory until expiry.
 *
 * Endpoints used:
 *  - POST /api/token                            (refresh)
 *  - GET  /me/player/currently-playing          (now playing)
 *  - GET  /me/player/recently-played?limit=1     (fallback when nothing is playing)
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN as string | undefined;

export const isSpotifyConfigured = Boolean(CLIENT_ID && REFRESH_TOKEN);

let accessToken: string | null = null;
let accessTokenExpiresAt = 0;

export interface SpotifyTrack {
  id: string;
  title: string;
  artists: string;
  album: string;
  albumArt: string | null;
  url: string;
  durationMs: number;
  progressMs: number | null;
}

export interface NowPlayingResult {
  /** True when Spotify is currently playing a track (not paused, not empty). */
  isPlaying: boolean;
  /** The track itself, regardless of state. */
  track: SpotifyTrack | null;
  /** Where the result came from — useful for the UI ("Now playing" vs "Last played"). */
  source: 'now-playing' | 'recent' | null;
}

async function refreshAccessToken(): Promise<string> {
  if (!CLIENT_ID || !REFRESH_TOKEN) {
    throw new Error('Spotify is not configured. Set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_REFRESH_TOKEN.');
  }
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
    client_id: CLIENT_ID,
  });
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  accessToken = json.access_token;
  // expires_in is seconds; subtract 60s as a safety margin.
  accessTokenExpiresAt = Date.now() + (json.expires_in - 60) * 1000;
  return accessToken as string;
}

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken;
  return refreshAccessToken();
}

async function authedFetch(path: string): Promise<Response> {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // 401 means the token is bad — refresh and retry once.
  if (res.status === 401) {
    accessToken = null;
    const fresh = await getAccessToken();
    return fetch(`https://api.spotify.com/v1${path}`, {
      headers: { Authorization: `Bearer ${fresh}` },
    });
  }
  return res;
}

/** Pull just the bits we care about out of a Spotify track/episode-ish object. */
function normalizeTrack(item: any): SpotifyTrack | null {
  if (!item) return null;
  // Skip non-tracks (episodes, ads, local files) — the widget is music-only.
  if (item.type !== 'track') return null;

  const artists: string = (item.artists ?? [])
    .map((a: any) => a.name)
    .filter(Boolean)
    .join(', ');

  const images: Array<{ url: string; width?: number; height?: number }> =
    item.album?.images ?? [];
  // Prefer ~64px cover; fall back to the smallest available.
  const albumArt =
    images.find((i) => i.width && i.width <= 100)?.url ??
    images[images.length - 1]?.url ??
    null;

  return {
    id: item.id,
    title: item.name ?? 'Unknown',
    artists: artists || 'Unknown artist',
    album: item.album?.name ?? '',
    albumArt,
    url: item.external_urls?.spotify ?? 'https://open.spotify.com',
    durationMs: item.duration_ms ?? 0,
    progressMs: null,
  };
}

/**
 * Fetch the now-playing track and (when nothing is playing) fall back to the
 * most recently played track so the widget still has something to show.
 */
export async function getNowPlaying(): Promise<NowPlayingResult> {
  if (!isSpotifyConfigured) {
    return { isPlaying: false, track: null, source: null };
  }

  // 1) Currently playing?
  try {
    const res = await authedFetch('/me/player/currently-playing');
    // 204 No Content = nothing playing
    if (res.status === 204) {
      return getRecentlyPlayed();
    }
    if (!res.ok) {
      return getRecentlyPlayed();
    }
    const data = await res.json();
    const track = normalizeTrack(data.item);
    if (!track) return getRecentlyPlayed();
    return {
      isPlaying: Boolean(data.is_playing),
      track: { ...track, progressMs: data.progress_ms ?? null },
      source: 'now-playing',
    };
  } catch {
    return { isPlaying: false, track: null, source: null };
  }
}

async function getRecentlyPlayed(): Promise<NowPlayingResult> {
  try {
    const res = await authedFetch('/me/player/recently-played?limit=1');
    if (!res.ok) return { isPlaying: false, track: null, source: null };
    const data = await res.json();
    const track = normalizeTrack(data.items?.[0]?.track);
    return { isPlaying: false, track, source: track ? 'recent' : null };
  } catch {
    return { isPlaying: false, track: null, source: null };
  }
}
