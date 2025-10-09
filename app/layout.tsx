import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-EPK Generator',
  description: 'Generate professional artist EPK with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

