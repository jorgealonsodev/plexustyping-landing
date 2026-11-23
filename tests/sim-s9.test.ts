import { describe, expect, it } from "vitest";
import { PHASES, PrivacyDemo, REST_MS, SCENARIOS, sentFields } from "../src/sim/data/s9";
import { S9_STRINGS } from "../src/sim/i18n/s9";
import { aiLength, buildProsePrompt, sourceLabel } from "../src/sim/privacy/prompt";
import type { Clock } from "../src/sim/replay";

function fakeClock() {
  const timers = new Map<number, { at: number; fn: () => void }>();
  let now = 0;
  let seq = 0;
  const clock: Clock = {
    set(fn, ms) {
      timers.set(++seq, { at: now + ms, fn });
      return seq;
    },
    clear: (h) => void timers.delete(h as number),
  };
  const advance = (ms: number) => {
    const until = now + ms;
    for (;;) {
      const due = [...timers.entries()].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      timers.delete(due[0]);
      now = due[1].at;
      due[1].fn();
    }
    now = until;
  };
  return { clock, advance };
}

describe("S9 prompt (ported from the app's plexustyping-ai prompt.rs)", () => {
  it("builds the app's prose prompt: only language, length and topic", () => {
    // The app's test prose_prompt_only_asks_for_a_text_in_the_language.
    expect(buildProsePrompt({ language: "es", length: { start: 250, end: 301 }, topic: "viajes" })).toBe(
      'Escribe un texto en español de 250–300 caracteres.\nTema: viajes.\nNo empieces con «El» ni con «La».\nResponde solo con JSON: {"text": "..."}',
    );
    expect(buildProsePrompt({ language: "en-US", length: { start: 240, end: 376 }, topic: "  a  train journey " })).toMatch(
      /^Escribe un texto en inglés de 240–375 caracteres\.\nTema: a train journey\.\n/,
    );
    expect(buildProsePrompt({ language: "es", length: { start: 40, end: 41 }, topic: null })).toContain("Tema: libre.");
  });

  it("asks for 80 % to 125 % of the chosen length (commands.rs ai_length)", () => {
    expect(aiLength(300)).toEqual({ start: 240, end: 376 });
    expect(aiLength(50)).toEqual({ start: 40, end: 63 });
    expect(aiLength(2000)).toEqual({ start: 1600, end: 2501 });
  });

  it("labels an AI text as the app does (prefetch.ts sourceLabel)", () => {
    expect(sourceLabel("claude")).toBe("Generado con IA · Claude");
    expect(sourceLabel("opencode-go")).toBe("Generado con IA · OpenCode Go");
  });
});

describe("S9 scenarios", () => {
  it("prose sends language, length and topic; code also targets and allowed characters; never what you type", () => {
    for (const locale of ["es", "en"] as const) {
      const t = S9_STRINGS[locale];
      expect(sentFields("prose").map((f) => f.key)).toEqual(["language", "length", "topic"]);
      expect(sentFields("code").map((f) => f.key)).toEqual(["language", "codeLanguage", "length", "topic", "targets", "allowed"]);
      for (const f of sentFields("code")) expect(t.fields[f.key]).toBeTruthy();
      expect(t.kept.length).toBeGreaterThan(0);
    }
    const prose = SCENARIOS.es.prompt;
    expect(prose).toBe(buildProsePrompt(SCENARIOS.es.request));
    expect(prose).not.toMatch(/Caracteres objetivo|Usa solo/);
    expect(SCENARIOS.en.request.language).toBe("en");
  });

  it("has no Spanish website string in the English table (app data aside)", () => {
    const en = JSON.stringify(S9_STRINGS.en);
    for (const word of ["Interfaz", "Núcleo", "Proveedor", "Reproducir", "Pausar", "demostración", "llavero"]) expect(en).not.toContain(word);
  });
});

describe("PrivacyDemo", () => {
  it("rests in the overview (every flow shown at once) and never starts under reduced motion", () => {
    const { clock, advance } = fakeClock();
    const changes: (number | null)[] = [];
    const demo = new PrivacyDemo({ reducedMotion: true, clock, onChange: (p) => changes.push(p) });
    expect(demo.phase).toBeNull();
    expect(demo.autoplay()).toBe(false);
    advance(60_000);
    expect(demo.phase).toBeNull();
    expect(changes).toEqual([]);
  });

  it("steps through the request and the reply in order, rests, and loops", () => {
    const { clock, advance } = fakeClock();
    const seen: (number | null)[] = [];
    const demo = new PrivacyDemo({ reducedMotion: false, clock, onChange: (p) => seen.push(p) });
    expect(demo.autoplay()).toBe(true);
    expect(demo.phase).toBe(0);
    for (let i = 1; i < PHASES.length; i++) {
      advance(PHASES[i - 1]!.ms);
      expect(demo.phase).toBe(i);
    }
    advance(PHASES.at(-1)!.ms);
    expect(demo.phase).toBeNull();
    advance(REST_MS);
    expect(demo.phase).toBe(0);
    expect(seen).toEqual([0, 1, 2, 3, null, 0]);
    expect(PHASES.map((p) => [p.from, p.to])).toEqual([
      ["ui", "core"],
      ["core", "provider"],
      ["provider", "core"],
      ["core", "ui"],
    ]);
  });

  it("pauses where it is and resumes from that phase", () => {
    const { clock, advance } = fakeClock();
    const demo = new PrivacyDemo({ reducedMotion: false, clock });
    demo.autoplay();
    advance(PHASES[0]!.ms);
    demo.pause();
    expect(demo.playing).toBe(false);
    advance(60_000);
    expect(demo.phase).toBe(1);
    demo.play();
    expect(demo.playing).toBe(true);
    advance(PHASES[1]!.ms);
    expect(demo.phase).toBe(2);
  });

  it("switching between prose and code restarts the flow", () => {
    const { clock, advance } = fakeClock();
    const demo = new PrivacyDemo({ reducedMotion: false, clock });
    demo.autoplay();
    advance(PHASES[0]!.ms + PHASES[1]!.ms);
    demo.setKind("code");
    expect(demo.kind).toBe("code");
    expect(demo.phase).toBe(0);
    demo.pause();
    demo.setKind("prose");
    expect(demo.phase).toBeNull();
  });
});
