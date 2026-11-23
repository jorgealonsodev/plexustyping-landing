// The screen reader messages of each site language: the app's own (announce.ts, Spanish) and their
// English translation (announce-en.ts).
import type { Locale } from "../../i18n/paths";
import * as en from "./announce-en";
import * as es from "./announce";

export interface Announcer {
  keystrokeMessage(wrong: { expected: string; typed: string } | null, next: string | undefined, moved: boolean): string;
  newTextMessage(chars: readonly string[]): string;
  resultMessage(stats: { netWpm: number; accuracy: number; durationMs: number; errors: number }): string;
}

export const ANNOUNCERS: Record<Locale, Announcer> = { es, en };
