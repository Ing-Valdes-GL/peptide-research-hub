import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

// Configuration SEO et Partage Social
export const metadata: Metadata = {
  title: {
    default: "Peptides Research Hub | Advanced Peptide Science",
    template: "%s | Peptides Research Hub"
  },
  description: "Peptides Research Hub provides cutting-edge peptide research and development with secure logistics across the UK.",
  metadataBase: new URL('https://alluvihealth.store'),

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: "Peptides Research Hub | Advanced Research",
    description: "Cutting-edge peptide research and development services.",
    url: 'https://alluvihealth.store',
    siteName: 'Peptides Research Hub',
    images: [
      {
        url: '/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'Peptides Research Hub Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Peptides Research Hub',
    description: 'Advanced Peptide Research.',
    images: ['/logo-share.png'],
  },

  // Icônes du navigateur
  icons: {
    icon: '/logo-share.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}