import type { Metadata } from "next"
import "./globals.css"
import type React from "react" // Import React

export const metadata: Metadata = {
  title: "Liteflix",
  description: "Your streaming platform",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={` bg-black text-white`}>{children}</body>
    </html>
  )
}

