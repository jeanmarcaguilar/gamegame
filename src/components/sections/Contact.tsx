import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { SectionTitle } from '@/components/SectionTitle';
import { ContactForm } from '@/components/ContactForm';
import { personalInfo } from '@/constants/personal';
import { fadeUp, staggerContainer } from '@/animations/variants';

const contactItems = [
  { icon: FaEnvelope, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { icon: FaMapMarkerAlt, label: 'Location', value: personalInfo.location, href: null },
  { icon: FaGithub, label: 'GitHub', value: 'github.com/jeanmarcaguilar', href: personalInfo.github },
  { icon: FaLinkedinIn, label: 'LinkedIn', value: 'linkedin.com/in/jeanmarcaguilar', href: personalInfo.linkedin },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-28 lg:py-36">
      <div className="bg-radial-glow absolute inset-0 -z-10 opacity-50" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Contact"
          title="Let's build something together"
          description="Whether it's an internship, a freelance project, or just a friendly hello — I'd love to hear from you."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Contact info */}
          <motion.aside
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-3 lg:col-span-2"
          >
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  variants={fadeUp}
                  className="group relative flex items-center gap-4 rounded-2xl glass p-4 glow-on-hover"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-primary-accent ring-1 ring-inset ring-primary/20 transition-all duration-300 group-hover:bg-primary/15 group-hover:text-text">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.16em] text-text-muted">
                      {item.label}
                    </div>
                    <div className="truncate text-sm font-medium text-text">{item.value}</div>
                  </div>
                </motion.div>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            <motion.div
              variants={fadeUp}
              className="mt-4 flex items-center gap-3 px-2"
            >
              <SocialIcon href={personalInfo.github} icon={FaGithub} label="GitHub" />
              <SocialIcon href={personalInfo.linkedin} icon={FaLinkedinIn} label="LinkedIn" />
              <SocialIcon href={personalInfo.twitter} icon={FaTwitter} label="Twitter" />
            </motion.div>
          </motion.aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialIcon({
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] text-text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary-accent"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
