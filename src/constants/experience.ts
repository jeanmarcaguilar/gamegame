export interface ExperienceEntry {
  id: string;
  type: 'Internship' | 'Freelance' | 'Academic' | 'Achievement';
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights?: string[];
}

export const experiences: ExperienceEntry[] = [
  {
    id: 'freelance-dev',
    type: 'Freelance',
    title: 'Freelance Web Developer',
    organization: 'Independent',
    period: '2024 — Present',
    description:
      'Designing and building small business websites and internal tools for local clients — owning everything from discovery to deployment.',
    highlights: [
      'Translated client requirements into clear technical scopes',
      'Delivered responsive sites with hand-written component systems',
      'Set up hosting, DNS, and basic analytics for each engagement',
    ],
  },
  {
    id: 'internship-it',
    type: 'Internship',
    title: 'IT Intern',
    organization: 'Local Tech Company',
    period: 'Summer 2024',
    description:
      'Worked alongside senior engineers on internal tooling, ticket triage, and small feature deliveries across the stack.',
    highlights: [
      'Built internal dashboards using React and Node.js',
      'Resolved Tier-1 support tickets and documented fixes',
      'Contributed to a service-restructure proposal',
    ],
  },
  {
    id: 'academic-smart-campus',
    type: 'Academic',
    title: 'Capstone — Smart Campus Attendance System',
    organization: 'University IT Department',
    period: '2024 — 2025',
    description:
      'Led the front-end and API design for a QR-based attendance platform used in pilot classes across the IT department.',
    highlights: [
      'Coordinated a team of four through weekly sprints',
      'Designed the API contract and data model',
      'Ran usability tests with faculty and student volunteers',
    ],
  },
  {
    id: 'achievement-blockchain',
    type: 'Achievement',
    title: 'Blockchain Track — Regional Hackathon',
    organization: 'University Hackathon 2024',
    period: '2024',
    description:
      'Built a working decentralized e-commerce prototype in 48 hours with on-chain escrow payments.',
    highlights: [
      'Sole developer — wrote Solidity contracts and React UI',
      'Presented demo to a panel of industry judges',
      'Awarded Best Use of Web3 in Track',
    ],
  },
  {
    id: 'academic-lead',
    type: 'Academic',
    title: 'Lead Developer — IT Student Council App',
    organization: 'Student Council',
    period: '2023 — 2024',
    description:
      'Built the council’s internal event and membership app adopted across the IT department.',
    highlights: [
      'Shipped a CRUD app used by ~400 students',
      'Set up a simple CI workflow on GitHub Actions',
    ],
  },
];

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  preview: string;
  credentialUrl: string;
}

export const certificates: Certificate[] = [
  {
    id: 'meta-front-end',
    title: 'Front-End Development Professional Certificate',
    issuer: 'Meta',
    date: '2024',
    preview: '/certs/meta-frontend.svg',
    credentialUrl: 'https://coursera.org/verify/example',
  },
  {
    id: 'cs50',
    title: 'CS50: Introduction to Computer Science',
    issuer: 'HarvardX',
    date: '2023',
    preview: '/certs/cs50.svg',
    credentialUrl: 'https://cs50.harvard.edu/certificates/example',
  },
  {
    id: 'js-algorithms',
    title: 'JavaScript Algorithms & Data Structures',
    issuer: 'freeCodeCamp',
    date: '2023',
    preview: '/certs/js-algorithms.svg',
    credentialUrl: 'https://freecodecamp.org/certification/example',
  },
  {
    id: 'responsive-web',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    date: '2023',
    preview: '/certs/responsive-web.svg',
    credentialUrl: 'https://freecodecamp.org/certification/example',
  },
  {
    id: 'blockchain-basics',
    title: 'Blockchain Basics',
    issuer: 'IBM',
    date: '2024',
    preview: '/certs/blockchain-basics.svg',
    credentialUrl: 'https://coursera.org/verify/example',
  },
  {
    id: 'php-dev',
    title: 'PHP & MySQL Web Development',
    issuer: 'University Extension',
    date: '2024',
    preview: '/certs/php-dev.svg',
    credentialUrl: 'https://example.edu/verify/example',
  },
];
