import type { Metadata } from 'next'
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
        {children}
      </body>
    </html>
  )
}
