/**
 * OS detection on /descargar (PRD §6.12): a progressive enhancement that only picks which download to
 * recommend first. Android reports "Linux" in its user agent and iPadOS reports "Macintosh", so both
 * are told apart before the desktop systems.
 */
import { describe, expect, it } from "vitest";
import { detectOs } from "../src/scripts/os-detect";

const UA = {
  ubuntuFirefox: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0",
  linuxChrome: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  windowsEdge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  macSafari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  chromeos: "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

describe("detectOs", () => {
  it("recognizes the two supported desktop systems", () => {
    expect(detectOs({ userAgent: UA.ubuntuFirefox })).toBe("linux");
    expect(detectOs({ userAgent: UA.linuxChrome })).toBe("linux");
    expect(detectOs({ userAgent: UA.windowsEdge })).toBe("windows");
  });

  it("prefers User-Agent Client Hints when the browser has them", () => {
    expect(detectOs({ userAgent: UA.linuxChrome, uaPlatform: "Windows" })).toBe("windows");
    expect(detectOs({ userAgent: "", uaPlatform: "Linux" })).toBe("linux");
  });

  it("tells phones and tablets apart from desktops", () => {
    expect(detectOs({ userAgent: UA.android })).toBe("mobile");
    expect(detectOs({ userAgent: UA.iphone })).toBe("mobile");
    expect(detectOs({ userAgent: UA.macSafari, maxTouchPoints: 5 })).toBe("mobile");
    expect(detectOs({ userAgent: UA.linuxChrome, uaPlatform: "Android", uaMobile: true })).toBe("mobile");
  });

  it("reports macOS, which has no build, and anything else as unknown", () => {
    expect(detectOs({ userAgent: UA.macSafari })).toBe("mac");
    expect(detectOs({ userAgent: UA.chromeos })).toBe("unknown");
    expect(detectOs({ userAgent: "" })).toBe("unknown");
  });
});
