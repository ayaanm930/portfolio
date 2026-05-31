import type { Metadata } from 'next'
import './globals.css'

import { AudioProvider } from '@/components/audio/AudioProvider'

export const metadata: Metadata = {
  title: 'Ayaan Mughal',
  description: 'Ayaan Mughal - CS Graduate Portfolio.',
  icons: [{ rel: 'icon', url: '/icon.png' }],
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

