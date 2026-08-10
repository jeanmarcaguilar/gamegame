import type { IconType } from 'react-icons';
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaPhp, FaNodeJs, FaJava, FaGithub,
  FaGitAlt, FaFigma, FaLinkedinIn, FaTwitter, FaEnvelope, FaCode,
  FaPython,
} from 'react-icons/fa';
import {
  SiTailwindcss, SiExpress, SiMysql, SiMongodb, SiCplusplus,
  SiVscodium, SiPostman, SiSolidity, SiEthereum, SiThreedotjs,
} from 'react-icons/si';

type IconMap = Record<string, IconType>;

const faIcons: IconMap = {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaPhp, FaNodeJs, FaJava, FaGithub,
  FaGitAlt, FaFigma, FaLinkedinIn, FaTwitter, FaEnvelope, FaPython,
};

const siIcons: IconMap = {
  SiTailwindcss, SiExpress, SiMysql, SiMongodb, SiCplusplus,
  SiVscodium, SiPostman, SiSolidity, SiEthereum, SiThreedotjs,
};

/**
 * Resolves a string icon name (used in static data files) to a
 * react-icons component. Falls back to FaCode when the name is unknown.
 */
export function getIcon(name: string): IconType {
  return faIcons[name] ?? siIcons[name] ?? FaCode;
}
