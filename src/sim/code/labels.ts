// The app's own interface labels inside the S8 and S10 demos (src/sim/code/AppScreen.svelte). In Spanish
// they are the app's words exactly (sources in each table's comments, app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390); in English, faithful translations for the English site.

export interface AppLabels {
  /** App.svelte header: the tagline and the profile button. */
  tagline: string;
  profile: string;
  /** App.svelte: the AI toggle's label. */
  ai: string;
  /** ModeSwitch.svelte: the group, its three kinds and the language select's name. */
  kindsLabel: string;
  prose: string;
  words: string;
  code: string;
  languageLabel: string;
  /** Practice.svelte: the typing field, the live stats and the text region (prose and code). */
  typingField: string;
  liveStats: string;
  wpm: string;
  kpm: string;
  accuracy: string;
  time: string;
  textRegion: string;
  codeRegion: string;
  /** prefetch.ts sourceLabel(): a corpus text. */
  source: string;
  /** focus.ts typingHint(): before and after the first keystroke. */
  hintStart: string;
  hintStarted: string;
}
