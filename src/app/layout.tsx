import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from '@/components/ComponentsExport';
import { Navbar } from "@/components/Navbar";
import "./globals.css";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// App configuration
const APP_CONFIG = {
  // Basic App Info
  NAME: "EnergyWise",
  DEFAULT_TITLE: "Smart Energy Monitor",
  TITLE_TEMPLATE: "%s | EnergyWise",
  DESCRIPTION: "Monitor and optimize your home energy usage with real-time analytics and smart recommendations.",
  VERSION: "1.0.0",

  // URLs and Links
  URL: process.env.NEXT_PUBLIC_APP_URL || "https://energywise.app",
  SUPPORT_URL: "https://support.energywise.app",

  // Theme Settings
  THEME: {
    PRIMARY_COLOR: "#10B981", // Green
    BG_COLOR: "#FFFFFF",
    DARK_BG_COLOR: "#1A1A1A",
  },

  // Social Media
  SOCIAL: {
    TWITTER: "@energywise",
    LINKEDIN: "energywise",
    INSTAGRAM: "energywise.app",
  },

  // Business Info
  COMPANY: {
    NAME: "EnergyTech Solutions",
    ADDRESS: "123 Energy Street, Green City",
    EMAIL: "support@energywise.app",
  },

  // App Categories
  CATEGORIES: ["Energy Management", "Smart Home", "Sustainability"],

  // Important Keywords
  KEYWORDS: [
    "energy monitoring",
    "smart home",
    "solar power",
    "energy optimization",
    "power consumption",
    "renewable energy",
    "energy analytics",
    "smart grid",
    "home automation",
    "sustainability",
  ],
};

// Metadata configuration
export const metadata: Metadata = {
  applicationName: APP_CONFIG.NAME,
  title: {
    default: APP_CONFIG.DEFAULT_TITLE,
    template: APP_CONFIG.TITLE_TEMPLATE,
  },
  description: APP_CONFIG.DESCRIPTION,
  manifest: "/manifest.json",

  metadataBase: new URL(APP_CONFIG.URL),

  // Enhanced icons configuration
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon.ico', sizes: '48x48' },
      { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: APP_CONFIG.THEME.PRIMARY_COLOR },
    ],
  },

  // Enhanced Apple specific configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_CONFIG.DEFAULT_TITLE,
  },

  // Format detection configuration
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // OpenGraph configuration
  openGraph: {
    type: "website",
    siteName: APP_CONFIG.NAME,
    title: {
      default: APP_CONFIG.DEFAULT_TITLE,
      template: APP_CONFIG.TITLE_TEMPLATE,
    },
    description: APP_CONFIG.DESCRIPTION,
    url: APP_CONFIG.URL,
    locale: "en_US",
  },

  // Twitter configuration
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_CONFIG.DEFAULT_TITLE,
      template: APP_CONFIG.TITLE_TEMPLATE,
    },
    description: APP_CONFIG.DESCRIPTION,
    creator: APP_CONFIG.SOCIAL.TWITTER,
    images: [`${APP_CONFIG.URL}/twitter-image.jpg`],
  },

  keywords: APP_CONFIG.KEYWORDS,
  category: APP_CONFIG.CATEGORIES[0],
  authors: [{ name: APP_CONFIG.COMPANY.NAME, url: APP_CONFIG.URL }],
  creator: APP_CONFIG.COMPANY.NAME,
  publisher: APP_CONFIG.COMPANY.NAME,

  // Additional metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": APP_CONFIG.NAME,
    "msapplication-TileColor": APP_CONFIG.THEME.PRIMARY_COLOR,
    "msapplication-tap-highlight": "no",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: APP_CONFIG.THEME.PRIMARY_COLOR,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "light dark",
  minimumScale: 1,
};

// Root Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <div
          className={`
              relative 
              flex 
              min-h-[100dvh] 
              flex-col 
              bg-background 
              antialiased
              ${inter.className}
            `}
        >
          {/* Max width container */}
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 px-4 pt-4 pb-24">
              {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Toast Notifications */}
            <Toaster />
          </div>
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html >
  );
}