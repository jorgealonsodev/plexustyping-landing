/**
 * OS detection for /descargar (PRD §6.12), a progressive enhancement: without JavaScript the page
 * already offers every download. With it, the container marked `data-os-detect` gets
 * `data-detected="<os>"`, which CSS uses to put the visitor's download first, and the matching
 * `[data-os-note="<os>"]` note is unhidden. Nothing leaves the browser.
 */
export type DetectedOs = "linux" | "windows" | "mac" | "mobile" | "unknown";

export interface OsSignals {
  userAgent: string;
  /** `navigator.userAgentData.platform` (Client Hints), when the browser has it. */
  uaPlatform?: string | undefined;
  /** `navigator.userAgentData.mobile`. */
  uaMobile?: boolean | undefined;
  /** `navigator.maxTouchPoints`: iPadOS reports a Mac user agent but a touch screen. */
  maxTouchPoints?: number | undefined;
}

export function detectOs({ userAgent, uaPlatform, uaMobile, maxTouchPoints = 0 }: OsSignals): DetectedOs {
  const platform = (uaPlatform ?? "").toLowerCase();
  if (uaMobile || platform === "android" || platform === "ios") return "mobile";
  if (platform === "windows") return "windows";
  if (platform === "linux") return "linux";
  if (platform === "macos") return "mac";
  if (platform === "chrome os" || platform === "chromeos") return "unknown";

  const ua = userAgent;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return "mobile";
  if (/Macintosh|Mac OS X/.test(ua)) return maxTouchPoints > 1 ? "mobile" : "mac";
  if (/Windows NT/.test(ua)) return "windows";
  if (/CrOS/.test(ua)) return "unknown";
  if (/Linux|X11/.test(ua)) return "linux";
  return "unknown";
}

interface UaData {
  platform?: string;
  mobile?: boolean;
}

/** Reads the browser's signals and marks the page (see the module comment). */
export function applyOsDetection(doc: Document = document): DetectedOs {
  const nav = doc.defaultView?.navigator;
  if (!nav) return "unknown";
  const uaData = (nav as Navigator & { userAgentData?: UaData }).userAgentData;
  const os = detectOs({
    userAgent: nav.userAgent,
    uaPlatform: uaData?.platform,
    uaMobile: uaData?.mobile,
    maxTouchPoints: nav.maxTouchPoints,
  });
  for (const el of doc.querySelectorAll<HTMLElement>("[data-os-detect]")) el.dataset.detected = os;
  for (const el of doc.querySelectorAll<HTMLElement>("[data-os-note]")) el.hidden = el.dataset.osNote !== os;
  return os;
}
