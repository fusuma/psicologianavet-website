import type { ReactNode, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  /**
   * The theme variant to apply ('dark' for Tutors, 'green' for Vets)
   * @default 'dark'
   */
  theme?: 'dark' | 'green';
  /**
   * The content to be rendered within the layout
   */
  children: ReactNode;
}

/**
 * Layout component provides a themeable page structure with header, main content area, and footer.
 * Supports 'dark' and 'green' themes based on the section (Tutors vs Vets).
 */
export function Layout({ theme = 'dark', children }: LayoutProps): ReactElement {
  return (
    <div className={cn(
      'min-h-screen flex flex-col bg-background text-foreground',
      theme === 'dark' ? 'theme-dark' : 'theme-green'
    )}>
      <header className="w-full px-4 py-6 md:px-8 md:py-8" role="banner">
        <nav className="flex justify-center" role="navigation" aria-label="Main navigation">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/images/psicologianavet.png"
              alt="Psicologia na Vet"
              width={200}
              height={60}
              className="h-12 w-auto md:h-14"
              priority
            />
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full px-4 py-8 md:px-8 md:py-12" id="main-content">
        {children}
      </main>

      <footer className="w-full px-4 py-6 md:px-8 md:py-8 border-t border-foreground/10" role="contentinfo">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/psicologianavet"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:[color:hsl(var(--foreground-hover))]"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@psicologianavet"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:[color:hsl(var(--foreground-hover))]"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:[color:hsl(var(--foreground-hover))]"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          </div>
          <a
            href="https://www.giseleschneider.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:[color:hsl(var(--foreground-hover))]"
          >
            Por Gisele Schneider
          </a>
        </div>
      </footer>
    </div>
  );
}
