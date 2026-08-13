import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
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
    <section id="contact" className="relative py-24 sm:py-28 lg:py-36 overflow-hidden">
      
      {/* Ambient glowing orbits background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-20 -left-[20%] w-[50%] h-[500px] rounded-[100%] border-t border-r border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] -rotate-12" />
        <div className="absolute bottom-10 -right-[10%] w-[40%] h-[400px] rounded-[100%] border-t border-l border-blue-400/30 rotate-45" />
        {/* Glow points */}
        <div className="absolute top-[35%] left-[5%] h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.8)]" />
        <div className="absolute bottom-[20%] right-[15%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.8)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-500 uppercase">Contact</span>
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl text-balance"
          >
            Let&apos;s build <br className="hidden sm:block" />
            <span className="text-blue-500">something together</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-gray-400 text-pretty"
          >
            Whether it&apos;s an internship, a freelance project, or just a friendly hello —
            I&apos;d love to hear from you.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Contact info (Left Column) */}
          <motion.aside
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-3 lg:col-span-4"
          >
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  variants={fadeUp}
                  className="group flex items-center gap-5 rounded-2xl bg-[#080b14] border border-white/5 p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0a0f1c]"
                >
                  <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-0.5">
                      {item.label}
                    </div>
                    <div className="truncate text-[13px] font-medium text-gray-300 group-hover:text-white transition-colors">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                >
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}

            {/* Social Links Footer */}
            <motion.div variants={fadeUp} className="mt-6 pl-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                Let&apos;s Connect
              </h4>
              <div className="flex items-center gap-4">
                <SocialIcon href={personalInfo.github} icon={FaGithub} label="GitHub" />
                <SocialIcon href={personalInfo.linkedin} icon={FaLinkedinIn} label="LinkedIn" />
                <SocialIcon href={personalInfo.twitter} icon={FaTwitter} label="Twitter" />
              </div>
            </motion.div>
          </motion.aside>

          {/* Form (Right Column) */}
          <div className="lg:col-span-8">
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
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
