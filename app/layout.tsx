import type { Metadata } from 'next'
import { Inter} from 'next/font/google'
import './globals.css'
import Pocketbase from 'pocketbase'

export const api = new Pocketbase(``)
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: 'Postr 6.2',
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
    </html>
  )
}
