// The S1 hero demo's data per site language: Spanish pages keep the app's Spanish corpus and the es-qwerty
// layout (./demo.ts, ./es-qwerty.ts, ./sequences.ts); English pages use the app's English corpus and the
// English (US) layout (./demo.en.ts, ./us-qwerty.en.ts, ./sequences.en.ts). S2 reuses these packs.
import type { Locale } from "../../i18n/paths";
import type { CharScore } from "../keyboard/heat";
import { KEYBOARDS, type SimKeyboard } from "../keyboard/locale";
import type { Script } from "../replay";
import * as es from "./demo";
import * as en from "./demo.en";

export interface DemoPack extends SimKeyboard {
  diagnosticText: string;
  targetText: string;
  diagnosticScript: Script;
  targetScript: Script;
  /** Steps of the diagnostic replay before it asks for a new text. */
  diagnosticSteps: number;
  /** Steps of the targets text typed in the still state. */
  stillSteps: number;
  targets: string[];
  heatScores: CharScore[];
  diagnosticSource: string;
  targetSource: string;
}

const pack = (d: typeof es | typeof en, keyboard: SimKeyboard): DemoPack => ({
  ...keyboard,
  diagnosticText: d.DIAGNOSTIC_TEXT,
  targetText: d.TARGET_TEXT,
  diagnosticScript: d.DIAGNOSTIC_SCRIPT,
  targetScript: d.TARGET_SCRIPT,
  diagnosticSteps: d.DIAGNOSTIC_STEPS,
  stillSteps: d.STILL_STEPS,
  targets: d.TARGETS,
  heatScores: d.HEAT_SCORES,
  diagnosticSource: d.DIAGNOSTIC_SOURCE,
  targetSource: d.TARGET_SOURCE,
});

export const DEMO_PACKS: Record<Locale, DemoPack> = {
  es: pack(es, KEYBOARDS.es),
  en: pack(en, KEYBOARDS.en),
};
