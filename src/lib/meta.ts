import type { Metadata } from "next";

/** Title, description, and canonical link for one page. `path` is relative to the site root, such as "sorting/". */
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}
