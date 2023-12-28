import type { Metadata } from 'next'
import { Inter} from 'next/font/google'
import Head from 'next/head'
import './globals.css'
import { GeistSans } from 'geist/font/sans';
 
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: 'Postr',
  description: 'Helping you safely share your content with the world.',
}
 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>{children}</body>
      <Head>
      <link rel="shortcut icon" href="/icons/icon-blue.jpg" type="image/x-icon" />
      <link rel='manifest' href='/pwa/manifest.json' />
      <link rel="stylesheet" href="/css.css"  key="test"/>
      </Head>
    </html>
  )
}
