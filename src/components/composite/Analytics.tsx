import Script from 'next/script';
import type { ReactElement } from 'react';

/**
 * Integrates Google Analytics tracking for all pages.
 * Loads GA script and initializes page view tracking.
 * Only renders if NEXT_PUBLIC_GA_ID is configured.
 *
 * @returns Analytics scripts if GA_ID configured, null otherwise
 */
export function Analytics(): ReactElement | null {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
