export interface Skill {
  name: string;
  icon: string;
  description: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}

export type GlobeSkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Programming'
  | 'Tools';

export interface GlobeSkill {
  name: string;
  icon: string; // resolves via getIcon()
  color: string; // hex — used for the node glow tint
  category: GlobeSkillCategory;
}

/**
 * Flat list of technologies rendered as floating nodes around the
 * 3D Skills globe. Positions are not stored here — they're generated
 * via Fibonacci-sphere distribution inside the `SkillsGlobe` component
 * so the cards naturally surround the sphere.
 */
export const globeSkills: GlobeSkill[] = [
  { name: 'React', icon: 'FaReact', color: '#9333EA', category: 'Frontend' },
  { name: 'TypeScript', icon: 'SiTypescript', color: '#9333EA', category: 'Frontend' },
  { name: 'Node.js', icon: 'FaNodeJs', color: '#9333EA', category: 'Backend' },
  { name: 'Next.js', icon: 'SiNextdotjs', color: '#9333EA', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: 'SiTailwindcss', color: '#9333EA', category: 'Frontend' },
  { name: 'Python', icon: 'FaPython', color: '#9333EA', category: 'Programming' },
  { name: 'JavaScript', icon: 'FaJs', color: '#9333EA', category: 'Frontend' },
  { name: 'GraphQL', icon: 'SiGraphql', color: '#9333EA', category: 'Backend' },
  { name: 'PostgreSQL', icon: 'SiPostgresql', color: '#9333EA', category: 'Database' },
  { name: 'Docker', icon: 'FaDocker', color: '#9333EA', category: 'Tools' },
];

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    description: 'Crafting clean, accessible interfaces.',
    skills: [
      { name: 'HTML', icon: 'FaHtml5', description: 'Semantic, accessible markup.', level: 90 },
      { name: 'CSS', icon: 'FaCss3Alt', description: 'Modern layouts & motion.', level: 88 },
      { name: 'JavaScript', icon: 'FaJs', description: 'ES6+, async patterns.', level: 85 },
      { name: 'React', icon: 'FaReact', description: 'Hooks, context, performance.', level: 82 },
      { name: 'Tailwind CSS', icon: 'SiTailwindcss', description: 'Utility-first styling.', level: 88 },
    ],
  },
  {
    title: 'Backend',
    description: 'Reliable, well-documented APIs.',
    skills: [
      { name: 'PHP', icon: 'FaPhp', description: 'Modern PHP & frameworks.', level: 80 },
      { name: 'Node.js', icon: 'FaNodeJs', description: 'Async, event-driven runtimes.', level: 75 },
      { name: 'Express.js', icon: 'SiExpress', description: 'Lightweight HTTP servers.', level: 72 },
    ],
  },
  {
    title: 'Database',
    description: 'Schema design & query optimization.',
    skills: [
      { name: 'MySQL', icon: 'SiMysql', description: 'Relational DB design.', level: 78 },
      { name: 'MongoDB', icon: 'SiMongodb', description: 'Document-based storage.', level: 70 },
    ],
  },
  {
    title: 'Programming',
    description: 'Strong computer-science fundamentals.',
    skills: [
      { name: 'Java', icon: 'FaJava', description: 'OOP, data structures.', level: 80 },
      { name: 'C++', icon: 'SiCplusplus', description: 'Systems & algorithms.', level: 65 },
    ],
  },
  {
    title: 'Tools',
    description: 'Workflow & collaboration.',
    skills: [
      { name: 'Git', icon: 'FaGitAlt', description: 'Version control workflows.', level: 88 },
      { name: 'GitHub', icon: 'FaGithub', description: 'CI/CD, code review.', level: 85 },
      { name: 'VS Code', icon: 'SiVscodium', description: 'Daily-driver editor.', level: 92 },
      { name: 'Figma', icon: 'FaFigma', description: 'Design hand-off.', level: 70 },
      { name: 'Postman', icon: 'SiPostman', description: 'API testing & docs.', level: 82 },
    ],
  },
  {
    title: 'Blockchain',
    description: 'Exploring decentralized apps.',
    skills: [
      { name: 'Solidity', icon: 'SiSolidity', description: 'Smart contract language.', level: 60 },
      { name: 'MetaMask', icon: 'SiEthereum', description: 'Web3 wallet integration.', level: 65 },
    ],
  },
];
