export const personalInfo = {
  name: 'Jean Marc Aguilar',
  shortName: 'Jiim',
  role: 'Aspiring Full Stack Developer',
  subRole: 'IT Graduate | Web Developer ',
  email: 'jeanmarcaguilar829@gmail.com',
  location: 'Philippines',
  github: 'https://github.com/jeanmarcaguilar',
  linkedin: 'https://linkedin.com/in/jeanmarcaguilar',
  twitter: 'https://twitter.com/jeanmarcaguilar',
  resumeUrl: '/resume.pdf',
  bio: `Building Modern, Reliable, and User-Focused Web Applications.

I'm an Information Technology graduate passionate about creating modern, responsive, and user-friendly web applications. I specialize in full-stack development, enjoy solving real-world problems through technology, and continuously improve my skills to build clean, scalable, and maintainable software.`,
  shortBio: `Dedicated IT student passionate about technology and software development. Eager to gain practical experience and contribute to team projects.`,
  tagline: 'Building clean, modern, and user-focused web experiences.',
} as const;

export const typingRoles = [
  'Full Stack Developer',
  'Backend Developer',
  'Front-End Developer',
  'Java Script Developer',
  'React Developer',
  'Node.js Developer',
  'Blockchain Developer',

] as const;

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
] as const;

export const socials = [
  { name: 'GitHub', href: personalInfo.github, icon: 'FaGithub' as const },
  { name: 'LinkedIn', href: personalInfo.linkedin, icon: 'FaLinkedinIn' as const },
  { name: 'Twitter', href: personalInfo.twitter, icon: 'FaTwitter' as const },
  { name: 'Email', href: `mailto:${personalInfo.email}`, icon: 'FaEnvelope' as const },
] as const;

export const stats = [
  { label: 'Projects Completed', value: 12 },
  { label: 'Technologies Learned', value: 18 },
  { label: 'Certificates', value: 6 },
  { label: 'GitHub Repositories', value: 24 },
] as const;
