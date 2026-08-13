import { Footer } from '@/components/sections/Footer';
import { Navbar } from './Navbar';
import { ThemeTransition } from '@/components/ThemeTransition';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useSmoothScroll(80);
  return (
    <div className="relative min-h-screen bg-bg text-text">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative pb-28">
        {children}
      </main>
      <Footer />
      <ThemeTransition />
    </div>
  );
}
