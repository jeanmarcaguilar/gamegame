import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { Certificate } from '@/constants/experience';

interface CertificateCardProps {
  cert: Certificate;
  index: number;
}

export function CertificateCard({ cert, index }: CertificateCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.08, 0.35), ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
      className="group relative overflow-hidden rounded-2xl glass glow-on-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <CertificateArtwork title={cert.title} issuer={cert.issuer} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card)] to-transparent opacity-30" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.16em] text-primary-accent">{cert.issuer}</span>
          <span className="text-xs text-text-muted">{cert.date}</span>
        </div>
        <h3 className="mt-2 font-display text-base font-semibold leading-tight text-text">
          {cert.title}
        </h3>
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-300 hover:text-primary-accent"
        >
          Verify credential
          <FaExternalLinkAlt className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.article>
  );
}

function CertificateArtwork({ title, issuer }: { title: string; issuer: string }) {
  return (
    <svg
      viewBox="0 0 400 250"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${title} certificate`}
    >
      <defs>
        <linearGradient id="cert-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-art-bg-from)" />
          <stop offset="100%" stopColor="var(--color-art-bg-to)" />
        </linearGradient>
        <linearGradient id="cert-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
        </linearGradient>
        <pattern id="cert-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="var(--color-art-grid)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#cert-bg)" />
      <rect width="400" height="250" fill="url(#cert-grid)" />
      <circle cx="60" cy="40" r="80" fill="url(#cert-glow)" opacity="0.5" />
      <circle cx="360" cy="220" r="60" fill="url(#cert-glow)" opacity="0.4" />
      {/* Medal */}
      <g transform="translate(200 110)">
        <circle r="40" fill="none" stroke="url(#cert-glow)" strokeWidth="2" />
        <circle r="28" fill="var(--color-art-fg)" stroke="var(--color-art-stroke)" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Space Grotesk"
          fontSize="16"
          fontWeight="700"
        >
          {issuer.slice(0, 1).toUpperCase()}
        </text>
      </g>
      {/* Title */}
      <text
        x="200"
        y="195"
        textAnchor="middle"
        fill="var(--color-art-text)"
        fontFamily="Inter"
        fontSize="13"
        fontWeight="600"
      >
        Certificate of Completion
      </text>
      <text
        x="200"
        y="218"
        textAnchor="middle"
        fill="var(--color-art-text-muted)"
        fontFamily="Inter"
        fontSize="11"
      >
        {issuer}
      </text>
    </svg>
  );
}