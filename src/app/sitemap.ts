import type { MetadataRoute } from "next";
import { ENTRIES } from "@/data/entries";
import { NAV, TOPICS_PAGE, topicHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [
    "/",
    TOPICS_PAGE.href,
    ...NAV.flatMap((g) => g.links.map((l) => l.href)),
    ...ENTRIES.map((e) => topicHref(e.id)),
    "/Big-O-Sheet.pdf",
    "/Big-O-Sheet-one-page.pdf",
  ];
  return paths.map((p) => ({ url: SITE_URL + p.replace(/^\//, ""), lastModified }));
}
