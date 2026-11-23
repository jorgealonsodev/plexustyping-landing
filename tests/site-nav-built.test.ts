/**
 * Site header navigation over the built site, after `pnpm build` (skipped without dist/):
 * odd/tasks/site-pages.md S15 (T12). The desktop row keeps its three links; on phones a hamburger button opens a
 * side drawer built on the HTML popover attribute (no JavaScript), with the same three links and the current
 * section marked with aria-current.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type HTMLElement, parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const DIST = join(import.meta.dirname, "..", "dist");
const built = existsSync(join(DIST, "index.html")) && existsSync(join(DIST, "en.html"));

const page = (file: string): HTMLElement => parse(readFileSync(join(DIST, file), "utf8"));

const LOCALES = [
  {
    locale: "es",
    home: "index.html",
    section: { file: "docs.html", href: "/docs" },
    links: [
      { href: "/funciones", label: "Funciones" },
      { href: "/docs", label: "Documentación" },
      { href: "/novedades", label: "Novedades" },
    ],
    navLabel: "Principal",
    open: "Abrir menú",
    close: "Cerrar menú",
    drawerLabel: "Menú",
    download: { href: "/descargar", label: "Descargar" },
  },
  {
    locale: "en",
    home: "en.html",
    section: { file: "en/docs.html", href: "/en/docs" },
    links: [
      { href: "/en/features", label: "Features" },
      { href: "/en/docs", label: "Documentation" },
      { href: "/en/release-notes", label: "What's new" },
    ],
    navLabel: "Main",
    open: "Open menu",
    close: "Close menu",
    drawerLabel: "Menu",
    download: { href: "/en/download", label: "Download" },
  },
] as const;

const linkList = (root: HTMLElement | null) =>
  (root?.querySelectorAll("a") ?? []).map((a) => ({ href: a.getAttribute("href"), label: a.text.trim() }));

describe.skipIf(!built)("site header navigation (S15)", () => {
  for (const l of LOCALES) {
    describe(l.locale, () => {
      const home = () => page(l.home);
      const header = () => home().querySelector("header.site-header")!;

      it("keeps the desktop nav with its three links", () => {
        const nav = header().querySelector(`nav[aria-label="${l.navLabel}"]`);
        expect(nav).not.toBeNull();
        expect(linkList(nav!.querySelector("ul.links"))).toEqual(l.links);
      });

      it("has a hamburger button that targets the drawer, with an accessible name", () => {
        const button = header().querySelector("button[popovertarget]:not([popovertargetaction])");
        expect(button).not.toBeNull();
        expect(button!.getAttribute("aria-label")).toBe(l.open);
        const id = button!.getAttribute("popovertarget")!;
        const drawer = header().querySelector(`#${id}`);
        expect(drawer).not.toBeNull();
        expect(drawer!.tagName).toBe("NAV");
        expect(drawer!.hasAttribute("popover")).toBe(true);
        expect(drawer!.getAttribute("aria-label")).toBe(l.drawerLabel);
      });

      it("puts the three links and a close button inside the drawer", () => {
        const drawer = header().querySelector("nav[popover]")!;
        expect(linkList(drawer.querySelector("ul"))).toEqual(l.links);
        const close = drawer.querySelector('button[popovertargetaction="hide"]');
        expect(close).not.toBeNull();
        expect(close!.getAttribute("popovertarget")).toBe(drawer.id);
        expect(close!.getAttribute("aria-label")).toBe(l.close);
      });

      it("offers the download link inside the drawer (the header button hides on phones)", () => {
        const cta = header().querySelector("nav[popover] a.drawer-cta");
        expect(cta).not.toBeNull();
        expect({ href: cta!.getAttribute("href"), label: cta!.text.trim() }).toEqual(l.download);
      });

      it("hides the header download button and keeps the wordmark in the phone layout", () => {
        const css = readdirSync("dist/_astro")
          .filter((f) => f.endsWith(".css"))
          .map((f) => readFileSync(`dist/_astro/${f}`, "utf8"))
          .join("\n");
        expect(css).toMatch(/\.cta\[data-astro-cid-[\w-]+\]\{display:none\}/);
        expect(css).not.toMatch(/\.brand\[data-astro-cid-[\w-]+\] span\[data-astro-cid-[\w-]+\]\{display:none\}/);
      });

      it("marks only the current section in the drawer and in the desktop row", () => {
        const h = page(l.section.file).querySelector("header.site-header")!;
        for (const list of [h.querySelector("ul.links")!, h.querySelector("nav[popover] ul")!]) {
          const current = list.querySelectorAll("a[aria-current]");
          expect(current.map((a) => a.getAttribute("href"))).toEqual([l.section.href]);
          expect(current[0]!.getAttribute("aria-current")).toBe("page");
        }
        expect(header().querySelectorAll("nav[popover] a[aria-current]")).toHaveLength(0);
      });
    });
  }
});
