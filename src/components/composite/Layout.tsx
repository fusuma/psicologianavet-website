import type { ReactNode, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

      <footer className="w-full px-4 py-6 md:px-8 md:py-8" role="contentinfo">
        {/* Placeholder for future footer content */}
      </footer>
    </div>
  );
}
