import type { ReactNode, ReactElement } from 'react';
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
      'min-h-screen flex flex-col',
      theme === 'dark' ? 'theme-dark' : 'theme-green'
    )}>
      <header className="w-full px-4 py-6 md:px-8 md:py-8">
        {/* Placeholder for future navigation */}
      </header>

      <main className="flex-1 w-full px-4 py-8 md:px-8 md:py-12">
        {children}
      </main>

      <footer className="w-full px-4 py-6 md:px-8 md:py-8">
        {/* Placeholder for future footer content */}
      </footer>
    </div>
  );
}
