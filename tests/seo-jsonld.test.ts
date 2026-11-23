import { describe, expect, it } from "vitest";
import snapshot from "../src/data/release-snapshot.json";
import { parseRelease } from "../src/lib/release";
import {
  breadcrumbListNode,
  faqPageNode,
  graph,
  howToNode,
  organizationNode,
  serializeJsonLd,
  softwareApplicationNode,
  techArticleNode,
  websiteNode,
} from "../src/lib/seo/jsonld";

const site = new URL("https://plexus.example");
const release = parseRelease(snapshot, "snapshot");

describe("JSON-LD helpers (docs/seo-2026.md §B7)", () => {
  it("graph wraps nodes in one @graph with the schema.org context", () => {
    expect(graph({ "@type": "Thing" })).toEqual({ "@context": "https://schema.org", "@graph": [{ "@type": "Thing" }] });
  });

  it("WebSite has name, alternateName, url and language, and no SearchAction", () => {
    const n = websiteNode(site, "es");
    expect(n).toMatchObject({ "@type": "WebSite", name: "PlexusTyping", url: "https://plexus.example/", inLanguage: "es" });
    expect(n.alternateName).toBeTruthy();
    expect(JSON.stringify(n)).not.toContain("SearchAction");
  });

  it("Organization has a raster logo of at least 112 px and sameAs to GitHub", () => {
    const n = organizationNode(site);
    expect(n["@type"]).toBe("Organization");
    expect(n.logo).toMatchObject({ "@type": "ImageObject", url: "https://plexus.example/og/logo.png", width: 512, height: 512 });
    expect(n.sameAs).toEqual(["https://github.com/jorgealonsodev/plexustyping", "https://github.com/jorgealonsodev"]);
  });

  it("SoftwareApplication takes version, date and download URL from the release, with no rating", () => {
    const n = softwareApplicationNode(site, release, "es");
    expect(n).toMatchObject({
      "@type": "SoftwareApplication",
      name: "PlexusTyping",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Linux, Windows",
      softwareVersion: "0.1.0",
      datePublished: "2026-11-19",
      downloadUrl: "https://plexus.example/descargar",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      license: ["https://spdx.org/licenses/MIT.html", "https://spdx.org/licenses/Apache-2.0.html"],
    });
    expect(n).not.toHaveProperty("aggregateRating");
    expect(n).not.toHaveProperty("review");
    expect(softwareApplicationNode(site, release, "en").downloadUrl).toBe("https://plexus.example/en/descargar");
  });

  it("BreadcrumbList numbers absolute items from 1", () => {
    const n = breadcrumbListNode(site, [
      { name: "Inicio", path: "/" },
      { name: "Documentación", path: "/docs" },
      { name: "Instalar", path: "/docs/empezar/instalar" },
    ]);
    expect(n.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://plexus.example/" },
      { "@type": "ListItem", position: 2, name: "Documentación", item: "https://plexus.example/docs" },
      { "@type": "ListItem", position: 3, name: "Instalar", item: "https://plexus.example/docs/empezar/instalar" },
    ]);
  });

  it("TechArticle carries dates as YYYY-MM-DD, author and publisher", () => {
    const n = techArticleNode(site, {
      path: "/docs/empezar/instalar",
      headline: "Instalar",
      description: "d",
      locale: "es",
      datePublished: new Date("2026-11-20T00:00:00Z"),
      dateModified: new Date("2026-11-21T00:00:00Z"),
    });
    expect(n).toMatchObject({
      "@type": "TechArticle",
      headline: "Instalar",
      inLanguage: "es",
      datePublished: "2026-11-20",
      dateModified: "2026-11-21",
      url: "https://plexus.example/docs/empezar/instalar",
      author: { "@id": "https://plexus.example/#organization" },
      publisher: { "@id": "https://plexus.example/#organization" },
      isPartOf: { "@id": "https://plexus.example/#website" },
    });
  });

  it("FAQPage and HowTo build their nested types", () => {
    expect(faqPageNode([{ question: "¿Q?", answer: "A." }]).mainEntity).toEqual([
      { "@type": "Question", name: "¿Q?", acceptedAnswer: { "@type": "Answer", text: "A." } },
    ]);
    expect(howToNode({ name: "Instalar", steps: [{ name: "Paso", text: "Haz" }] }).step).toEqual([
      { "@type": "HowToStep", position: 1, name: "Paso", text: "Haz" },
    ]);
  });

  it("serializeJsonLd escapes < so the data cannot close its script element", () => {
    const s = serializeJsonLd({ text: "</script><b>" });
    expect(s).not.toContain("<");
    expect(JSON.parse(s)).toEqual({ text: "</script><b>" });
  });
});
