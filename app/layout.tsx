import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { withAuth } from "@workos-inc/authkit-nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/providers/convex-provider"
import "./globals.css"

import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ["400", "500", "600", "700"]
})

const lora = Lora({ 
  subsets: ['latin'], 
  weight: ["400", "500", "600", "700"]
})

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'], 
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Jigsaw — Strategic Planning System",
  description: "Visualise and manage your organisation's strategy through Logic Models, Contribution Maps, Development Pathways, and Convergence Maps.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { accessToken } = await withAuth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} font-sans antialiased`}>
        <ConvexClientProvider expectAuth={!!accessToken}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
