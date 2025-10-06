import type { Metadata } from 'next'
import type { ReactNode, ReactElement } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quando um amor se vai',
  description: 'Landing page for pet loss support services',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}): ReactElement {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
