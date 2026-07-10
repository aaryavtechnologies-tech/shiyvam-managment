import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/react-query";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivyam Management Services — People | Process | Performance",
  description:
    "Shivyam Management Services connects elite professionals with top-tier organizations across India. Discover premium management, finance, consulting, and leadership opportunities.",
  keywords: [
    "Shivyam Management Services",
    "management jobs India",
    "corporate jobs",
    "senior level hiring",
    "finance jobs",
    "consulting jobs",
    "leadership roles",
    "executive recruitment India",
  ],
  authors: [{ name: "Shivyam Management Services" }],
  creator: "Shivyam Management Services",
  publisher: "Shivyam Management Services",
  metadataBase: new URL("https://shivyam.in"),
  openGraph: {
    title: "Shivyam Management Services — People | Process | Performance",
    description:
      "Connect with elite organizations and discover premium opportunities in management, finance, and operations. Your next big career move starts here.",
    url: "https://shivyam.in",
    siteName: "Shivyam Management Services",
    images: [
      {
        url: "/logo.png",
        width: 1080,
        height: 1080,
        alt: "Shivyam Management Services Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivyam Management Services",
    description:
      "Premium corporate recruitment platform — People | Process | Performance",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
