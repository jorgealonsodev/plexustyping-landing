// Demo texts (demostración). Both come from the PlexusTyping app's Spanish corpus at app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390, unchanged:
// - DIAGNOSTIC_TEXT: crates/plexustyping-corpus/data/es/diagnostic.txt, trimmed as the corpus loader does.
// - TARGET_TEXT: four corpus sentences that contain the demo targets ñ, qu and z, joined by spaces as a
//   prose text is: "Este verano…" and "Nos gusta pasear…" and "Guarda los documentos…" from sentences.txt,
//   "Y si nos gusta la zona…" from sentences-cv.txt. The app picks such sentences itself (Rust); here they
//   are a fixed sample.

export const DIAGNOSTIC_TEXT =
  "¿Sabes qué pasó ayer? Un búho y un pingüino vieron a Xavier comer kiwi junto al fuego; Wanda, la niña, gritó: ¡Qué jaleo tan extraño! Mamá dijo que nadie debía tocar el violín después de la cena, pero Hugo lo afinó con cuidado y tocó una zamba lenta. Al final, todos aplaudieron felices bajo la luz de la luna.";

export const TARGET_TEXT =
  "Este verano queremos ir a la montaña con unos amigos. Nos gusta pasear por el parque cuando empieza a hacer calor. Y si nos gusta la zona podemos quedarnos un par de añitos. Guarda los documentos importantes en una carpeta azul.";
