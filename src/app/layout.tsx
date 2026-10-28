import type { Metadata, Viewport } from "next";
import { OG_IMAGE } from "@/lib/meta";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";
import LiveRegion from "@/components/layout/LiveRegion";
import Shortcuts from "@/components/layout/Shortcuts";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { asset } from "@/lib/utils";
import Providers from "./providers";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Big O cheat sheet: time and space complexity | BigOSheet",
    template: "%s | BigOSheet",
  },
  description:
    "Interactive Big O cheat sheet for coding interviews: time and space complexity of data structures, sorting, and graph algorithms, with a quiz and visualizer.",
  authors: [AUTHOR],
  creator: AUTHOR.name,
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
    ...(process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION
      ? {
          other: {
            ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
              ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
              : {}),
            "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
          },
        }
      : {}),
  },
  icons: {
    icon: [
      { url: asset("/favicon.ico"), type: "image/x-icon" },
      { url: asset("/icon.png"), type: "image/png", sizes: "32x32" },
      { url: asset("/icon.svg"), type: "image/svg+xml" },
    ],
    shortcut: asset("/favicon.ico"),
    apple: [{ url: asset("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" }],
  },
  manifest: asset("/site.webmanifest"),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Big O cheat sheet: time and space complexity",
    description:
      "Interactive Big O reference for DSA and coding interviews: complexity tables, a playground, an algorithm visualizer, a quiz, and printable PDFs.",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: "#12151a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": SITE_URL + "#website",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en",
      publisher: { "@id": SITE_URL + "#person" },
    },
    {
      "@type": "Person",
      "@id": SITE_URL + "#person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    {
      "@type": "WebApplication",
      "@id": SITE_URL + "#application",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      image: SITE_URL + OG_IMAGE.url,
      author: { "@id": SITE_URL + "#person" },
    },
    {
      "@type": "LearningResource",
      "@id": SITE_URL + "#learning-resource",
      name: "Big O cheat sheet",
      description:
        "Time and space complexity of common data structures, sorting algorithms, and graph and tree algorithms for DSA and coding interviews.",
      url: SITE_URL,
      image: SITE_URL + OG_IMAGE.url,
      inLanguage: "en",
      learningResourceType: "Reference",
      isAccessibleForFree: true,
      license: "https://opensource.org/licenses/MIT",
      teaches: ["Big O notation", "Time complexity", "Space complexity", "Data structures", "Sorting algorithms", "Graph algorithms"],
      author: { "@id": SITE_URL + "#person" },
      publisher: { "@id": SITE_URL + "#person" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <LiveRegion />
          <SiteHeader />
          <noscript>
            <p className="noscript">
              The reference tables work without JavaScript. Search, saved progress, and the interactive tools need it.
            </p>
          </noscript>
          <main id="main">{children}</main>
          <SiteFooter />
          <Shortcuts />
        </Providers>
      </body>
    </html>
  );
}
