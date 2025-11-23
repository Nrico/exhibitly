import '../css/globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair_display = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600'] })
const cormorant_garamond = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'Exhibitly | The Digital Standard for Fine Art',
  description: 'The minimalist platform designed specifically for independent artists and curated galleries.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair_display.variable} ${cormorant_garamond.variable} bg-bg-color text-text-main font-sans leading-relaxed antialiased`}>
        {children}
      </body>
    </html>
  );
}
