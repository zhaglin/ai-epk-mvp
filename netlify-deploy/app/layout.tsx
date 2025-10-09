import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArtistOne — Профессиональный EPK за минуту',
  description: 'Создайте профессиональный электронный пресс-кит для артиста с помощью AI. Автоматическая генерация BIO, улучшение фото и экспорт в PDF.',
  keywords: ['EPK', 'Electronic Press Kit', 'AI', 'Artist Bio', 'Music', 'DJ', 'Press Kit Generator'],
  authors: [{ name: 'ArtistOne Team' }],
  openGraph: {
    title: 'ArtistOne — Профессиональный EPK за минуту',
    description: 'Создайте профессиональный электронный пресс-кит для артиста с помощью AI',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}

