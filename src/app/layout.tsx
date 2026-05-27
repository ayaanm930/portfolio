import type { Metadata } from 'next'
import './globals.css'

import { AudioProvider } from '@/components/audio/AudioProvider'

export const metadata: Metadata = {
  title: 'Ayaan Mughal — Portfolio',
  description: 'AI Engineer & CS Graduate portfolio.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  )
}

