import type { Metadata } from 'next'
import { Inter} from 'next/font/google'
import './globals.css'
import Pocketbase from 'pocketbase'
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: 'Tweeter - Signup',
  description: '',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>{children}</body>
      <link rel="shortcut icon" href="/tweeter.png" type="image/x-icon" />
    </html>
  )
}
