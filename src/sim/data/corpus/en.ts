// Copied verbatim from the PlexusTyping app's English corpus, crates/plexustyping-corpus/data/en/ (app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390): the English demo texts of the /en simulations (demo).
// Do not edit by hand: re-copy from the app instead.
// - DIAGNOSTIC: diagnostic.txt, trimmed as the corpus loader does.
// - SENTENCES: lines of sentences.txt and sentences-cv.txt (Mozilla Common Voice, CC0 1.0), unchanged.
// - WORDS: lines of words.txt (CC BY-SA 4.0, adapted from hermitdave/FrequencyWords), unchanged; the
//   progressive-unlock demo joins them into texts with only the active letters, as the app's prose does.
// Licenses: the app's data/en/LICENSE.md.

export const DIAGNOSTIC =
  "Did you hear what happened yesterday? A quick brown fox jumped over the lazy dog near the zoo; Xavier, the keeper, shouted: Wow, what a jump! Mother said that nobody should touch the violin after dinner, but Hugo tuned it with great care and played a slow waltz. In the end, everyone clapped happily under the quiet light of the moon.";

export const SENTENCES = {
  // sentences.txt
  picnic: "We are planning a quiet picnic by the lake this weekend.",
  summer: "Next summer we are going to spend two weeks by the sea.",
  toast: "This morning I had toast with butter and a cup of strong tea.",
  bus: "The bus was late because there was a lot of traffic in the centre.",
  sundays: "On Sundays we usually have lunch with our grandparents.",
  milk: "We need to buy milk, bread, eggs and some fresh fruit.",
  umbrella: "I forgot my umbrella at home, so I got completely wet.",
  neighbour: "My neighbour has a big dog that barks at every passing bicycle.",
  kitchen: "The kitchen smells wonderful when my father bakes bread.",
  bookshop: "My sister works in a small bookshop near the train station.",
  children: "The children played in the park until it started to rain.",
  cat: "The cat sleeps on the sofa every afternoon in the sun.",
  grandmother: "My grandmother knits warm scarves for the whole family.",
  // sentences-cv.txt
  pizza: "Most kids love pizza and eat it every week.",
  quick: "Her bright quick eye catches the truth immediately.",
} as const;

export const WORDS = [
  "a", "all", "as", "had", "has", "dad", "lads", "salad",
  "he", "she", "asked", "feels", "glad",
  "the", "that", "last", "left",
  "to", "look", "at", "old", "told", "those", "flag",
  "is", "this", "said", "still", "good", "life",
  "keep", "rhythm",
] as const;
