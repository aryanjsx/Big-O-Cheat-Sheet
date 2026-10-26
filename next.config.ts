import type { NextConfig } from "next";

// The site is fully static. `next build` writes plain HTML, CSS, and JS to `out/`,
// which can be hosted anywhere, including GitHub Pages.
// Set NEXT_PUBLIC_BASE_PATH when the site is served from a subpath, such as
// "/Big-O-Cheat-Sheet" on GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
