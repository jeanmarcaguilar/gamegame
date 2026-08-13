import { Helmet } from 'react-helmet-async';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Certificates } from '@/components/sections/Certificates';
import { Contact } from '@/components/sections/Contact';
import { Divider } from '@/components/Divider';
import { personalInfo } from '@/constants/personal';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{personalInfo.name} — {personalInfo.role}</title>
        <meta name="description" content={personalInfo.bio} />
      </Helmet>
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Skills />
      <Divider />
      <Projects />
      <Divider />
      <Experience />
      <Divider />
      <Certificates />
      <Divider />
      <Contact />
    </>
  );
}
