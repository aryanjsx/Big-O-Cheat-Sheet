import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Big O cheat sheet: time and space complexity | BIGOSHEET",
  description:
    "Interactive Big O cheat sheet for coding interviews: time and space complexity of data structures, sorting, and graph algorithms, with a quiz and visualizer.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "BIGOSHEET",
    title: "Big O cheat sheet: time and space complexity",
    description:
      "Interactive Big O reference for DSA and coding interviews: complexity tables, a playground, an algorithm visualizer, a quiz, and printable PDFs.",
    url: "./",
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Big O cheat sheet",
  description:
    "Time and space complexity of common data structures, sorting algorithms, and graph and tree algorithms for DSA and coding interviews.",
  url: SITE_URL,
  inLanguage: "en",
  learningResourceType: "Reference",
  isAccessibleForFree: true,
  license: "https://opensource.org/licenses/MIT",
  teaches: ["Big O notation", "Time complexity", "Space complexity", "Data structures", "Sorting algorithms", "Graph algorithms"],
  author: { "@type": "Person", name: "aryanjsx", url: "https://github.com/aryanjsx" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
