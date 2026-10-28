# SEO checklist

This is an implementation and handoff checklist, not a promise of search position. Search engines choose whether and how to index pages and determine rankings independently.

## Implemented in this change

- [x] Confirmed Next.js App Router with static export (`output: "export"`). The production homepage returned HTTP 200 and contained the title, canonical, structured data, navigation, and page content in its initial HTML; reference tables are HTML, not images.
- [x] Corrected the default canonical/metadata base from the old GitHub Pages URL to `https://bigosheet.aryankr.in/`; aligned the package homepage and CI's declared public canonical host.
- [x] Added a crawl-all `robots.txt` with the sitemap URL and an `llms.txt` describing the real reference pages.
- [x] Added a web manifest, viewport theme color, and references to the existing SVG icon for browser, shortcut, and Apple icon slots. Existing Next.js metadata already supplies the 1200 x 630 Open Graph/Twitter share image.
- [x] Added WebSite, Person, WebApplication, and LearningResource JSON-LD. FAQPage JSON-LD corresponds to the eight visible home-page FAQ answers. Main reference pages and topic pages emit visible breadcrumbs and matching BreadcrumbList/TechArticle data.
- [x] Added crawlable explanatory copy and an eight-question FAQ to the home page; preserved existing routes and linked to existing basics, sorting, data-structure, and topic references instead of creating duplicate-content URLs.
- [x] Added captions and column header scope to the primary sorting, data-structure, and algorithm reference tables. The content remains server-rendered HTML.
- [x] Added optional Google, Bing, and Yandex verification meta tags, enabled only when the corresponding environment variable is set.
- [x] The repository already has MIT licensing, contribution guidance, screenshot alt text, issue templates, topic pages, and a static sitemap.

## Audit notes and limits

- [x] Production host checked at implementation time: `https://bigosheet.aryankr.in/` returned HTTP 200 and its initial HTML included the complete page content. Before this change, the response's canonical and Open Graph URLs incorrectly used `https://aryanjsx.github.io/BigOSheet/`.
- [x] The current host redirects HTTP to HTTPS and the no-trailing-slash sorting URL to its trailing-slash version; an unknown path returns 404. The `www` host did not resolve during the check. If `www.bigosheet.aryankr.in` should work, add it as a domain in Vercel, point its DNS record at the configured Vercel target, and set a redirect to the non-www canonical host.
- [ ] Recheck live `robots.txt`, `llms.txt`, sitemap, canonical, and social image after deploying this branch. Code changes in this branch do not change the live site until deployed.
- [ ] Post-change Lighthouse scores are not measured yet: PageSpeed Insights can test only the live deployment, and these changes have not been deployed. Run PageSpeed Insights after deployment and record Performance, Accessibility, Best Practices, and SEO for mobile and desktop; aim for 90+, then fix actual reported issues.

### Lighthouse before/after

Scores are Performance / Accessibility / Best Practices / SEO. The “before” readings are one-time PageSpeed Insights lab tests of the existing live site on 2026-10-28, before this branch's changes; they are not field Core Web Vitals or ranking guarantees.

| Version | Device | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Before (live site) | Mobile | 98 | 100 | 100 | 100 | 1.951 s | 0 |
| Before (live site) | Desktop | 100 | 100 | 100 | 100 | 0.338 s | 0 |
| After (this branch) | Mobile | Pending deployment | Pending | Pending | Pending | Pending | Pending |
| After (this branch) | Desktop | Pending deployment | Pending | Pending | Pending | Pending | Pending |

INP was not measured by these single lab runs; review Search Console's field Core Web Vitals report after enough real-user data is available.
- [ ] Redirect behavior for `http`, `www`, and slash variants depends on the active host configuration. Confirm each variant redirects to the HTTPS, non-www, trailing-slash canonical URL in the hosting dashboard; a static export cannot configure server redirects by itself.
- [ ] No analytics provider is installed. Choose GA4 or a privacy-friendly provider such as Plausible/Umami before adding a tracking script and any required consent/privacy disclosures.

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console/) and add the **Domain** property `aryankr.in` (covers `bigosheet.aryankr.in` and other subdomains).
2. Copy the TXT value Google provides. In the DNS zone for `aryankr.in`, add that exact TXT record at the host Google specifies (commonly `@` for a domain property). Do not use a sample token.
3. Wait for DNS propagation and click **Verify**. Alternatively, use the URL-prefix property `https://bigosheet.aryankr.in/` and set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to its supplied meta-tag token in the production build environment.
4. After the branch is deployed, submit `https://bigosheet.aryankr.in/sitemap.xml` under **Sitemaps**.
5. In **URL inspection**, inspect and request indexing for the homepage, `/basics/`, `/data-structures/`, `/sorting/`, `/algorithms/`, and useful `/topics/<id>/` pages. Requesting indexing is not a guarantee of inclusion.

## Bing, DuckDuckGo, Yahoo, Brave, and Yandex

1. In [Bing Webmaster Tools](https://www.bing.com/webmasters/), import the verified Google Search Console property or add `https://bigosheet.aryankr.in/`, complete its verification, and submit the same `/sitemap.xml`.
2. For meta-tag verification, set `NEXT_PUBLIC_BING_SITE_VERIFICATION` to the `msvalidate.01` value and rebuild/redeploy. DuckDuckGo and Yahoo use Bing's index and discovery signals; submission does not guarantee their inclusion.
3. Submit the site through [Brave Search webmaster submission](https://search.brave.com/help/webmaster-submission) and follow its current verification flow.
4. For Yandex, optionally add the site in [Yandex Webmaster](https://webmaster.yandex.com/), verify it, submit the sitemap, and set `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` to its provided token if meta verification is selected.
5. Optional IndexNow: create a key in Bing Webmaster Tools, publish the exact key file at the production site root, then configure the deployment pipeline to POST changed canonical URLs to `https://api.indexnow.org/indexnow` using that key. Keep the key in deployment secrets; do not commit a private credential. No IndexNow key or ping is configured in this repository yet.

## GitHub repository

- [x] Updated the README title, description, live demo, screenshot alt text, complexity preview, tech stack, and links to contribution/licensing guidance.
- [x] `LICENSE`, `CONTRIBUTING.md`, and the issue templates already exist; added `CODE_OF_CONDUCT.md`.
- [ ] Set the GitHub social preview image manually in **Settings → General → Social preview** by uploading the generated 1280 x 640 `out/social-preview.png` after a production build.
- [ ] Review the repository's About description, website, and topics. Suggested topics: `big-o`, `big-o-notation`, `time-complexity`, `space-complexity`, `data-structures`, `algorithms`, `dsa`, `cheatsheet`, `interview-preparation`, `coding-interview`, `leetcode`, `computer-science`.

## White-hat visibility checklist

- [ ] Publish useful, original articles on Dev.to, Hashnode, or Medium and set each article's canonical URL to the matching BigOSheet reference page.
- [ ] Share in Reddit communities only when relevant, following each subreddit's self-promotion and contribution rules; answer questions with useful explanations rather than dropping links.
- [ ] Consider a transparent Show HN post, Product Hunt listing, LinkedIn/X posts, and submissions to relevant maintained algorithm/interview resource lists. Follow each community's submission rules; do not buy links, exchange links, or mass-post.
- [ ] Ask educators, college DSA groups, and maintainers of relevant learning resources for editorial review or inclusion where genuinely useful.

### Long-tail article ideas

1. Quicksort vs. merge sort: time, space, and when worst-case behavior matters.
2. Array vs. linked list complexity: why insertion location changes the answer.
3. Hash table average vs. worst-case lookup: collision and load-factor assumptions.
4. BFS vs. DFS complexity: adjacency lists, matrices, and memory trade-offs.
5. Amortized time complexity explained with dynamic-array append examples.

## Verify after deployment

- [ ] `curl -sS https://bigosheet.aryankr.in/` includes the full server-rendered content, title, description, canonical, Open Graph/Twitter image, and JSON-LD.
- [ ] `https://bigosheet.aryankr.in/robots.txt`, `/llms.txt`, and `/sitemap.xml` return 200 and the sitemap URLs use the canonical host.
- [ ] Validate JSON-LD with [Schema.org Validator](https://validator.schema.org/) and Google's [Rich Results Test](https://search.google.com/test/rich-results). FAQ structured data may not produce a Google rich result; it is not a ranking guarantee.
- [ ] To check indexing, search Google for `site:bigosheet.aryankr.in`. Results can be incomplete or delayed; URL Inspection in Search Console is the more useful diagnostic.
- [ ] Run Lighthouse/PageSpeed Insights after deployment and record the actual mobile/desktop scores and Core Web Vitals. Do not treat a lab score as a ranking promise.
