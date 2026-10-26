import type { Metadata } from "next";
import { SITE_NAME } from "./site";

/** The social preview image, built by app/og.png/route.tsx. The URL is relative to the site root. */
export const OG_IMAGE = {
  url: "og.png",
  width: 1200,
  height: 630,
  alt: "BigOSheet: time and space complexity, with the fine print",
  type: "image/png",
};

/** Title, description, canonical link, and social tags for one page. `path` is relative to the
    site root, such as "sorting/". A page's openGraph replaces the layout's, so the shared fields
    are repeated here. */
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
