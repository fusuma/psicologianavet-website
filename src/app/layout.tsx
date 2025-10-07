import type { Metadata } from 'next'
import type { ReactNode, ReactElement } from 'react'
import { Fira_Sans, Castoro } from 'next/font/google'
import './globals.css'
import { Analytics } from '@/components/composite/Analytics'

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['200', '600'],
  variable: '--font-fira-sans',
  display: 'swap',
})

const castoro = Castoro({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-castoro',
  display: 'swap',
})

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
      <body className={`${firaSans.variable} ${castoro.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
