import { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { AuthToastHandler } from "@/components/auth-toast-handler"
import { GoogleAdSenseScript } from "@/components/google-adsense-script"
import { GoogleAnalytics } from "@/components/google-analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    default: "Phrases",
    template: "%s | Phrases",
  },
  description: "Save and copy frequently used phrases quickly.",
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <GoogleAnalytics />
        <GoogleAdSenseScript />
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
          <Suspense fallback={null}>
            <AuthToastHandler />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
