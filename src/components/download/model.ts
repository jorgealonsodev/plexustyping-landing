/**
 * Data of the download page (spec S6, PRD §6.12): the latest release's artifacts grouped by OS, and the
 * install steps its HowTo JSON-LD describes. Names, sizes and sums come from the release the build read
 * (src/lib/release.ts), never typed by hand (docs/seo-2026.md §D6).
 */
import type { Locale } from "../../i18n/paths";
import type { AssetKind, Release, ReleaseAsset } from "../../lib/release";

export interface DownloadModel {
  version: string;
  tag: string;
  publishedAt: string;
  /** Release page on GitHub. */
  releaseUrl: string;
  linux: { deb: ReleaseAsset; tar: ReleaseAsset };
  windows: { exe: ReleaseAsset };
  sums: ReleaseAsset;
}

function pick(release: Release, kind: AssetKind): ReleaseAsset {
  const asset = release.assets.find((a) => a.kind === kind);
  if (!asset) throw new Error(`release ${release.tag}: no ${kind} artifact`);
  return asset;
}

/** Throws when an artifact is missing, so a broken release fails the build instead of the page. */
export function downloadModel(release: Release): DownloadModel {
  return {
    version: release.version,
    tag: release.tag,
    publishedAt: release.publishedAt,
    releaseUrl: release.url,
    linux: { deb: pick(release, "deb"), tar: pick(release, "tar.gz") },
    windows: { exe: pick(release, "exe") },
    sums: pick(release, "sums"),
  };
}

/** Installing the .deb, as README.md "Install" of the app describes it (HowTo JSON-LD), in the page's language. */
export function installSteps(m: DownloadModel, locale: Locale = "es"): { name: string; text: string }[] {
  const deb = m.linux.deb.name;
  if (locale === "en") {
    return [
      { name: "Download the package and SHA256SUMS", text: `Download ${deb} and SHA256SUMS of version ${m.version} into the same folder.` },
      { name: "Check the SHA-256 sum", text: "In that folder, run sha256sum -c SHA256SUMS --ignore-missing; it must answer “OK” for the package." },
      { name: "Install the package", text: `Run sudo apt install ./${deb}; apt also installs WebKitGTK 4.1 and GTK 3 if they are missing.` },
      { name: "Open it", text: "Open PlexusTyping from the applications menu." },
    ];
  }
  return [
    {
      name: "Descarga el paquete y SHA256SUMS",
      text: `Descarga ${deb} y SHA256SUMS de la versión ${m.version} en la misma carpeta.`,
    },
    {
      name: "Comprueba la suma SHA-256",
      text: "En esa carpeta, ejecuta sha256sum -c SHA256SUMS --ignore-missing; debe responder «OK» para el paquete.",
    },
    {
      name: "Instala el paquete",
      text: `Ejecuta sudo apt install ./${deb}; apt instala también WebKitGTK 4.1 y GTK 3 si faltan.`,
    },
    { name: "Ábrelo", text: "Abre PlexusTyping desde el menú de aplicaciones." },
  ];
}
