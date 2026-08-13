import { FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';
import { personalInfo, navLinks } from '@/constants/personal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 border-t border-[var(--color-border)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <a href="#home" className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-primary-accent ring-1 ring-inset ring-primary/20">
                <span className="font-display text-sm font-bold">JM</span>
              </span>
              <span className="font-display text-sm font-semibold tracking-tight text-text">
                {personalInfo.shortName}
                <span className="text-primary-accent">.</span>
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
              {personalInfo.tagline}
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-primary-accent">Navigate</div>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-muted transition-colors duration-300 hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-primary-accent">Connect</div>
            <div className="mt-3 flex items-center gap-2">
              <SocialLink href={personalInfo.github} icon={FaGithub} label="GitHub" />
              <SocialLink href={personalInfo.linkedin} icon={FaLinkedinIn} label="LinkedIn" />
              <SocialLink href={personalInfo.twitter} icon={FaTwitter} label="Twitter" />
              <SocialLink href={`mailto:${personalInfo.email}`} icon={FaEnvelope} label="Email" />
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="mt-4 inline-block text-sm text-text-muted transition-colors duration-300 hover:text-text"
            >
              {personalInfo.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-text-muted sm:flex-row">
          <span>
            © {year} {personalInfo.name}. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1.5">
            Built with
            <FaHeart className="h-3 w-3 text-primary" />
            using React, TypeScript & Tailwind CSS.
          </span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FaGithub;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] text-text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary-accent"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}