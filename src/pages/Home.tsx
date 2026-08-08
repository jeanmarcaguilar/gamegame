import { Helmet } from 'react-helmet-async';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { NowPlaying } from '@/components/sections/NowPlaying';
import { Certificates } from '@/components/sections/Certificates';
import { Contact } from '@/components/sections/Contact';
import { personalInfo } from '@/constants/personal';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{personalInfo.name} — {personalInfo.role}</title>
        <meta name="description" content={personalInfo.bio} />
      </Helmet>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <NowPlaying />
      <Certificates />
      <Contact />
    </>
  );
}
