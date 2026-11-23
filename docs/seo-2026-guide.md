# How SEO works in 2026: a practical guide

Research date: 2026-11-23. Sources: web search plus Google Search Central and Astro docs read through Context7.
Marks: **[D]** = official engine or framework documentation, **[3P]** = third-party study or press, **[Inf]** = inference.
The PlexusTyping-specific plan (schema decisions, robots.txt, per-page template) is in [`seo-2026.md`](./seo-2026.md). This guide covers the general practice it builds on.

## 1. The 2026 picture in five points

1. **AI search is still search.** Google's first generative-AI guide (2026-05-15) says AI Overviews and AI Mode run on the core ranking and quality systems. It adds: "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary." GEO and AEO are, in Google's words, terms "you may see used" for the same work [D].
2. **Eligibility is technical and binary.** The page must be indexed and eligible for a snippet. Blocking Googlebot, `noindex` or `nosnippet` remove it from AI features too [D].
3. **Rich results shrank.** FAQ rich results stopped showing in May 2026. Their documentation was removed on 2026-06-15. Practice-problem and Dataset types were also retired (Search Console support ended in January 2026). HowTo results ended in 2023 [D]. Structured data still describes entities. It is no longer a shortcut to SERP real estate [D; 3P].
4. **Quality enforcement is heavier.** A broad core update landed 2026-05-21, followed by spam updates in June and August that targeted scaled content and programmatic pages. Google also updated its site-reputation-abuse policy on 2026-08-28, and a broad core update has been rolling out since 2026-11-10 [D; 3P].
5. **There is more than one engine.** ChatGPT search draws on OpenAI's own index (OAI-SearchBot) plus Bing. One study found 87% of its citations matched Bing's top results [3P, unverified]. Only about 13.7% of citations overlap between Google AI Mode and AI Overviews [3P]. Measure each surface separately.

## 2. The foundation (nothing here is new, and all of it still decides rankings)

### Crawling and indexing
- Every indexable URL returns 200 and carries a self-referencing absolute canonical. Duplicates get a 301 or a canonical [D].
- XML sitemap with only canonical, indexable URLs. Set `lastmod` from real content changes. Google ignores `priority` and `changefreq` [D].
- Don't block CSS or JS in robots.txt: Google renders pages [D].
- Real 404s, not soft 404s. Keep redirect chains short.
- With Astro, set `site` in the config so canonicals and the sitemap use the production domain. Build the canonical with `new URL(Astro.url.pathname, Astro.site)` [D Astro].

### International sites
- `hreflang` links in `<head>`, one per language version **including itself**, identical on every version. Add an `x-default` fallback. Never combine `hreflang` with other attributes in one `<link>` [D].
- Pick one method (head, HTTP header or sitemap). Canonicals stay per language and never point across languages [D].

### Page experience
- Core Web Vitals "good" thresholds are unchanged: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, measured at the 75th percentile of field data [D web.dev]. Ignore blog claims of tighter thresholds; Google hasn't documented any [3P conflicting].
- CWV are a minor ranking signal. They don't compensate for crawl or content problems [3P].
- Static HTML, minimal JS, images with `width`/`height`. Astro's `<Image />` sets those attributes for you, which prevents CLS [D Astro]. Keep pages bfcache-eligible (no `Cache-Control: no-store`, no `unload` handlers).

## 3. On-page SEO in 2026

| Element | Practice |
|---|---|
| `<title>` | Unique, main term first, aligned with the `<h1>`. There's no fixed length, but Google truncates to the device width and rewrites boilerplate or mismatched titles [D] |
| Meta description | A unique summary with a concrete fact. Google uses it only sometimes [D] |
| Headings | One `<h1>`. `h2`/`h3` without skipping levels. Semantic HTML and landmarks (`header`, `nav`, `main`, `footer`) [D] |
| Opening paragraph | Answer the page's question directly, then give detail. Google says there is "no ideal page length" and that no rewriting or "chunking" for AI is needed [D] |
| Structure | Real lists and tables for steps, specs and comparisons. Short paragraphs. Easier to extract into summaries [3P; Inf] |
| Images | Real `<img>` with `alt`, descriptive file names, dimensions. Keep key information in text, not baked into images [D] |
| Internal links | Descriptive anchors. Topical clusters (a hub page plus linked detail pages) [3P: one study reports 3.2× more AI citations, unverified] |
| Dates | A visible "updated" date matching `dateModified`. No build dates or fake freshness [D] |
| URLs | Short, lowercase, hyphenated, in the page's language |

## 4. Content quality: what is rewarded and what is penalized

**Rewarded** (Google's guide lists "non-commodity content" first) [D]:
- First-hand experience: real screenshots, real data, real limits. This is the "Experience" in E-E-A-T.
- One page per real question or task, covering it completely, including the follow-up questions a user (or AI "fan-out") would ask next [3P].
- Clear authorship and an about page. Consistent entity facts (name, logo, profiles) across the web.
- Updating content when it actually changes. One vendor reports citations falling off after about 3 months without updates [3P, single source].

**Penalized** [D spam policies; 3P]:
- **Scaled content abuse:** many low-value pages, whether written by AI, humans or templates. Unedited AI text with no original input is the main 2026 risk.
- **Site reputation abuse:** third-party content hosted to borrow a site's ranking signals. Since 2026-08-30, outside the EEA, a manual action can hit only the affected section [D].
- Inauthentic mentions, fake reviews or ratings, and markup for content that isn't visible [D].

## 5. Structured data: where it stands

- Not required for AI features, and there's no special markup for them [D]. A May 2026 study found JSON-LD didn't measurably raise AI citations for pages already shown in AI Overviews [3P]. Vendor studies claiming large gains are unverified.
- Still worth it as an accurate entity description: `Organization`, `WebSite` (home page only), `BreadcrumbList`, `Article`/`TechArticle`, `SoftwareApplication`, `Product`. Validate with the Rich Results Test and URL Inspection [D].
- Don't add markup for retired features (FAQ, HowTo, sitelinks search box) expecting a rich result. Leaving it in is harmless [D].

## 6. Controls for AI features and AI crawlers

| Goal | Control |
|---|---|
| Appear in Google AI features | Allow Googlebot, stay indexable and snippet-eligible. Check the generative-AI setting in Search Console [D] |
| Limit what Google shows | `nosnippet`, `data-nosnippet` (only on `span`, `div`, `section`), `max-snippet`, `noindex`. `nosnippet` also stops the page from being used as direct input to AI Overviews and AI Mode [D] |
| Gemini training and grounding outside Search | `Google-Extended` in robots.txt. It doesn't affect Search ranking [D] |
| ChatGPT search citations | Allow `OAI-SearchBot`. `GPTBot` (training) can be blocked separately [D OpenAI; 3P] |
| Claude and Perplexity | `Claude-SearchBot` and `PerplexityBot` for search, `ClaudeBot` for training [D] |
| User-triggered fetchers | `ChatGPT-User`, `Perplexity-User`, `Google-Agent` (added in March 2026) act for a user and may ignore robots.txt [D; 3P] |
| llms.txt | Optional and cheap. Google says it isn't needed [D]. 97% of files got zero requests in May 2026 [3P Ahrefs] |

robots.txt is voluntary. To actually enforce a block you need server or CDN rules.

## 7. Beyond Google

- **Bing Webmaster Tools:** import the site from Search Console and enable **IndexNow** to push changed URLs. This feeds Bing, Copilot and the Bing-backed part of ChatGPT search; Google doesn't use IndexNow [D Bing; 3P].
- Bing's AI Performance report (Copilot citations) has been available since February 2026 [D].
- Earn mentions in the roundup articles and lists AI engines cite ("best X for Y"). Paid placement in ChatGPT search doesn't exist [3P].

## 8. Measurement in 2026

- **Search Console:** the Performance report plus the generative-AI performance report (Search and Discover) [D].
- **Bing Webmaster Tools:** AI Performance and citation share [D].
- **Track citations, not only clicks.** Note when a page is cited in AI Overviews, AI Mode, ChatGPT, Perplexity and Copilot, per query. Treat zero-click visibility as a brand metric [3P].
- **Field data:** CrUX or RUM for Core Web Vitals; lab tools only for debugging.
- **After each core update:** compare by page group (docs, features, home), not just site-wide.

## 9. Checklist

- [ ] Indexable pages: 200, self-canonical, in the sitemap, no accidental `noindex` or `nosnippet`
- [ ] `hreflang` + `x-default` identical on every language version
- [ ] Unique `<title>` and description; one `<h1>`; semantic landmarks
- [ ] First paragraph answers the page's question; lists and tables for steps and specs
- [ ] Original, first-hand content; no thin or templated variants
- [ ] Visible "updated" date matching `dateModified`; real authorship
- [ ] JSON-LD for entities only, validated; nothing for retired rich results
- [ ] robots.txt allows Googlebot, Bingbot and the AI search bots; training bots per your policy
- [ ] Search Console and Bing Webmaster Tools set up; IndexNow on deploy
- [ ] CWV good at p75 (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1)
- [ ] OG image 1200×630 PNG or JPEG with absolute URL
- [ ] Monthly: AI citations, CWV and indexing reports; review after each core update

## 10. Open or conflicting

- The benefit of schema for AI citations: studies conflict, and the pro-schema figures come from vendors.
- The exact wording and rollout of the Search Console generative-AI inclusion setting: secondary sources differ. Check the official guide.
- The effects of the November 2026 core update are unknown while it rolls out.
- Most citation statistics (87% Bing overlap, 13.7% AI Mode/AIO overlap, 3.2× for clusters, the 3-month freshness drop) are single-source vendor data.

## Sources

Official:
- Google, generative AI guide announcement (2026-05-15): https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing
- Google, AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google, robots meta tag and `data-nosnippet`: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google, localized versions (hreflang): https://developers.google.com/search/docs/specialty/international/localized-versions
- Google, documentation updates (FAQ removal 2026-06-15): https://developers.google.com/search/updates
- Google, breadcrumb, software app and structured data policies: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb, https://developers.google.com/search/docs/appearance/structured-data/software-app, https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google, site reputation policy update (2026-08-28): https://developers.google.com/search/blog/2026/08/update-site-reputation-policy
- Astro docs (canonical URL, `site`, sitemap, `<Image />`): https://github.com/withastro/docs

Third party:
- Semrush on Google's guide: https://www.semrush.com/blog/google-publishes-generative-ai-search-guide/
- DemandSphere, "AI search is still search": https://www.demandsphere.com/blog/google-ai-optimization-guide-ai-search-is-still-search/
- Search Engine Journal on structured data in 2026: https://www.searchenginejournal.com/google-is-not-diminishing-the-use-of-structured-data-in-2026/560516/
- PPC Land on retired structured data: https://ppc.land/google-phases-out-practice-problem-and-dataset-structured-data/
- GSQI, May 2026 core update and August 2026 spam update: https://www.gsqi.com/marketing-blog/core-roars-back-google-may-2026-core-update-analysis/, https://gsqi.com/marketing-blog/august-2026-google-spam-update-case-studies/
- Semrush, June 2026 spam update: https://www.semrush.com/blog/google-completes-spam-update-rollout/
- Ahrefs, llms.txt study: https://ahrefs.com/blog/llmstxt-study/
- PPC Land, llms.txt adoption: https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/
- LLMrefs, GEO guide (citation overlap): https://llmrefs.com/generative-engine-optimization
- Digital Applied, SEO after AI Overviews: https://www.digitalapplied.com/blog/seo-after-ai-overviews-complete-strategy-guide-2026
- Search Engine Land, ChatGPT search fan-out: https://searchengineland.com/inside-chatgpt-search-web-run-fan-out-queries-ai-visibility-477339
- seoClarity, ChatGPT bots crawl patterns: https://www.seoclarity.net/research/chatgpts-3-bots-crawl-patterns
- Seocom, CWV and INP 2026: https://seocom.agency/en/blog/core-web-vitals-2026-inp/
