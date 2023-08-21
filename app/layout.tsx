import '@/styles/globals.css';



import { Metadata } from 'next';



import { ClerkProvider } from '@clerk/nextjs';



import { siteConfig } from '@/config/site';



import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';



import { Toaster } from '@/components/ui/toaster';



import { SiteHeader } from '@/components/site-header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';





export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'recipe',
    'cooking',
    'AI',
    'artificial intelligence',
    'generator',
    'recipe generator',
    'mouthwatering',
    'delicious',
    'easy cooking',
  ],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  manifest: '/site.webmanifest',
  icons: {
    icon: ['/favicon-16x16.png', 'favicon-32x32.png'],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg' }],
  },
  openGraph: {
    title: 'Sauteq',
    description: 'Create mouthwatering recipes with the power of AI',
    url: 'https://sauteq.com',
    siteName: 'Sauteq',
    images: [
      {
        url: 'https://sauteq.com/og.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" className="" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen font-sans antialiased',
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SiteHeader />
            <main>{children}</main>
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}