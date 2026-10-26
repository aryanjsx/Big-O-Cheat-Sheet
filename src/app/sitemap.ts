import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["", "Big-O-Sheet.pdf", "Big-O-Sheet-one-page.pdf"].map((path) => ({ url: SITE_URL + path, lastModified }));
}
