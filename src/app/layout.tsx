import type { Metadata, Viewport } from "next"
import Providers from "@/providers"

import { META_THEME_COLORS, siteConfig } from "@/config/site"
import { getBaseURL } from "@/lib/baseUrl"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import "@/styles/globals.css"
import "@/styles/themes.css"

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = await getBaseURL()

  return {
    title: {
      default: `${siteConfig.name} - ${siteConfig.slogan}`,
      template: `%s - ${siteConfig.name}`,
    },
    metadataBase: new URL(BASE_URL),
    description: siteConfig.description,
    keywords: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Server Components",
      "Radix UI",
    ],
    authors: [
      {
        name: "Toufiq Hasan Kiron",
        url: "https://toufiqhasankiron.com",
      },
    ],
    creator: "Toufiq Hasan Kiron",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: new URL("/og.png", BASE_URL),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [new URL("/og.png", BASE_URL)],
      creator: "@hashtagkiron",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${BASE_URL}/site.webmanifest`,
  }
}

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh overflow-x-hidden bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
