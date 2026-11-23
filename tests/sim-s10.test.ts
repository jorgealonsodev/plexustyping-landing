import { describe, expect, it } from "vitest";
import { ANNOUNCERS } from "../src/sim/a11y/announcers";
import { A11yDemo, REST_MS, STILL_STEPS, TEXTS, TRANSCRIPT_SIZE } from "../src/sim/data/s10";
import { S10_STRINGS } from "../src/sim/i18n/s10";
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

const scriptMs = (locale: "es" | "en") => TEXTS[locale].script.steps.at(-1)!.atMs;

describe("S10 announcements", () => {
  it("Spanish: the app's own wording (announce.ts)", () => {
    const es = ANNOUNCERS.es;
    expect(es.keystrokeMessage(null, "a", true)).toBe("siguiente: a");
    expect(es.keystrokeMessage({ expected: "e", typed: "r" }, "e", false)).toBe("error: esperaba e, pulsaste r");
    expect(es.keystrokeMessage(null, " ", true)).toBe("siguiente: espacio");
    expect(es.newTextMessage([..."Hola"])).toBe("Texto nuevo de 4 caracteres. siguiente: h mayúscula");
    expect(es.resultMessage({ netWpm: 41.6, accuracy: 0.985, durationMs: 12_000, errors: 1 })).toBe(
      "Resultado: 42 PPM netas, precisión 98,5 %, tiempo 0:12, 1 error.",
    );
  });

  it("English: the same messages translated", () => {
    const en = ANNOUNCERS.en;
    expect(en.keystrokeMessage(null, "a", true)).toBe("next: a");
    expect(en.keystrokeMessage({ expected: "e", typed: "r" }, "e", false)).toBe("error: expected e, typed r");
    expect(en.keystrokeMessage({ expected: "e", typed: "r" }, "x", true)).toBe("error: expected e, typed r. next: x");
    expect(en.keystrokeMessage(null, " ", true)).toBe("next: space");
    expect(en.keystrokeMessage(null, ".", true)).toBe("next: period");
    expect(en.newTextMessage([..."My"])).toBe("New text of 2 characters. next: capital m");
    expect(en.newTextMessage([..."a"])).toBe("New text of 1 character. next: a");
    expect(en.resultMessage({ netWpm: 41.6, accuracy: 0.985, durationMs: 12_000, errors: 0 })).toBe(
      "Result: 42 net WPM, accuracy 98.5%, time 0:12, no errors.",
    );
  });
});

describe("S10 texts", () => {
  it("are corpus sentences of each language, typed with one corrected typo", () => {
    expect(TEXTS.es.text).toBe("Este verano queremos ir a la montaña con unos amigos.");
    expect(TEXTS.en.text).toBe("My sister works in a small bookshop near the train station.");
    for (const locale of ["es", "en"] as const) {
      expect(TEXTS[locale].script.errors).toBe(1);
      expect(TEXTS[locale].script.uncorrected).toEqual([]);
    }
  });
});

describe("A11yDemo", () => {
  for (const locale of ["es", "en"] as const) {
    const say = ANNOUNCERS[locale];
    const text = TEXTS[locale].text;

    it(`${locale}: the still state has the text partly typed and what the screen reader said`, () => {
      const { clock, advance } = fakeClock();
      const demo = new A11yDemo({ locale, reducedMotion: true, clock });
      expect(demo.session.chars.join("")).toBe(text);
      expect(demo.session.events.length).toBe(STILL_STEPS);
      expect(demo.screenReader).toBe(true);
      expect(demo.transcript.length).toBe(TRANSCRIPT_SIZE);
      expect(demo.transcript.at(-1)).toBe(say.keystrokeMessage(null, text[demo.session.cursor], true));
      expect(demo.autoplay()).toBe(false);
      advance(60_000);
      expect(demo.session.events.length).toBe(STILL_STEPS);
    });

    it(`${locale}: plays, announces the typo and the result, rests, then a new text`, () => {
      const { clock, advance } = fakeClock();
      const demo = new A11yDemo({ locale, reducedMotion: false, clock, still: false });
      const said: string[] = [];
      demo.onAnnounce = (m) => said.push(m);
      expect(demo.autoplay()).toBe(true);
      advance(scriptMs(locale));
      expect(demo.session.completed).toBe(true);
      const typo = TEXTS[locale].typo;
      expect(said).toContain(say.keystrokeMessage({ expected: typo.expected, typed: typo.typed }, text[typo.index + 1], true));
      const stats = demo.session.result().stats;
      expect(said.at(-1)).toBe(say.resultMessage(stats));
      expect(demo.transcript.at(-1)).toBe(said.at(-1));
      expect(demo.transcript.length).toBeLessThanOrEqual(TRANSCRIPT_SIZE);
      advance(REST_MS);
      expect(demo.session.cursor).toBeLessThanOrEqual(1);
      expect(said).toContain(say.newTextMessage([...text]));
    });
  }

  it("says nothing while the screen reader mode is off", () => {
    const { clock, advance } = fakeClock();
    const demo = new A11yDemo({ locale: "es", reducedMotion: false, clock });
    const said: string[] = [];
    demo.onAnnounce = (m) => said.push(m);
    demo.setScreenReader(false);
    expect(demo.screenReader).toBe(false);
    expect(demo.transcript).toEqual([]);
    demo.play();
    advance(3000);
    expect(demo.session.events.length).toBeGreaterThan(STILL_STEPS);
    expect(said).toEqual([]);
    expect(demo.transcript).toEqual([]);
    demo.setScreenReader(true);
    advance(1000);
    expect(said.length).toBeGreaterThan(0);
  });

  it("pauses where it is and resumes", () => {
    const { clock, advance } = fakeClock();
    const demo = new A11yDemo({ locale: "en", reducedMotion: false, clock });
    demo.autoplay();
    advance(1000);
    demo.pause();
    expect(demo.playing).toBe(false);
    const n = demo.session.events.length;
    advance(60_000);
    expect(demo.session.events.length).toBe(n);
    demo.play();
    advance(1000);
    expect(demo.session.events.length).toBeGreaterThan(n);
  });
});

describe("S10 strings", () => {
  it("Spanish setting labels are the app's (settings.ts)", () => {
    expect(S10_STRINGS.es.settings.screenReader).toEqual({
      label: "Anunciar con lector de pantalla",
      hint: "Anuncia el siguiente carácter, los errores, cada texto nuevo y el resultado (aria-live).",
    });
    expect(S10_STRINGS.es.settings.colorBlind).toEqual({
      label: "Modo daltónico",
      hint: "Destellos en azul y naranja en lugar de verde y rojo; una tecla errónea se subraya.",
    });
  });

  it("has no Spanish UI string in the English table", () => {
    const leaves = (x: unknown): string[] =>
      typeof x === "string" ? [x] : x && typeof x === "object" ? Object.values(x).flatMap(leaves) : [];
    const en = leaves(S10_STRINGS.en).join("\n");
    const leaks = leaves(S10_STRINGS.es).filter((s) => s.length > 3 && /[a-záéíóúñ]{4}/.test(s) && s !== "PlexusTyping" && en.includes(s));
    expect(leaks).toEqual([]);
  });
});
