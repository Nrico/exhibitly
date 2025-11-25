import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat, Cinzel, Fauna_One, Lato } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair_display = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600'] })
const cormorant_garamond = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '500', '600'] })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const fauna_one = Fauna_One({ subsets: ['latin'], variable: '--font-fauna', weight: ['400'] })
const lato = Lato({ subsets: ['latin'], variable: '--font-lato', weight: ['300', '400', '700'] })

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
      <body className={`${inter.variable} ${playfair_display.variable} ${cormorant_garamond.variable} ${montserrat.variable} ${cinzel.variable} ${fauna_one.variable} ${lato.variable}`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}