import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mango Range Component',
  description: 'Custom Range component technical test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="nav-brand">
              Range Component
            </Link>
            <div className="nav-links">
              <Link href="/exercise1" className="nav-link">
                Exercise 1
              </Link>
              <Link href="/exercise2" className="nav-link">
                Exercise 2
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
