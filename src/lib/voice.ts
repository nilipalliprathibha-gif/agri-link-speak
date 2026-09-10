/**
 * Browser speech helpers: text-to-speech + speech recognition.
 * Everything degrades silently when the browser has no speech support —
 * the visible UI is always the fallback.
 */

export function speechSupported() {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

export function recognitionSupported() {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

let muted = false;

export function setVoiceMuted(value: boolean) {
  muted = value;
  if (value && speechSupported()) window.speechSynthesis.cancel();
}

export function isVoiceMuted() {
  return muted;
}

export function speak(text: string, locale = "en-IN") {
  if (!speechSupported() || muted || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.95;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang === locale);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* speech is optional */
  }
}

type RecognitionHandle = { stop: () => void };

export function listenOnce(
  locale: string,
  onResult: (transcript: string) => void,
  onEnd?: (error?: string) => void,
): RecognitionHandle | null {
  if (!recognitionSupported()) {
    onEnd?.("unsupported");
    return null;
  }
  const Ctor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
      .webkitSpeechRecognition;
  if (!Ctor) {
    onEnd?.("unsupported");
    return null;
  }
  const recognition = new Ctor();
  recognition.lang = locale;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript ?? "";
    if (transcript) onResult(transcript);
  };
  recognition.onerror = (event) => onEnd?.(event.error ?? "error");
  recognition.onend = () => onEnd?.();
  recognition.start();
  return { stop: () => recognition.stop() };
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

/* ---------------- intent parsing ---------------- */

export type VoiceIntent =
  | { kind: "search"; crop?: string | undefined }
  | { kind: "order"; crop?: string | undefined; quantity?: number | undefined }
  | { kind: "orderStatus" }
  | { kind: "complaint" }
  | { kind: "addCrop" }
  | { kind: "cart" }
  | { kind: "help" }
  | { kind: "earnings" }
  | { kind: "home" }
  | { kind: "unknown"; text: string };

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  twenty: 20, fifty: 50, hundred: 100, thousand: 1000,
};

export const KNOWN_CROPS = [
  "maize", "tomato", "rice", "onion", "potato", "wheat", "chilli", "brinjal", "banana", "mango",
  "cotton", "groundnut", "turmeric", "sugarcane",
];

const CROP_ALIASES: Record<string, string> = {
  మొక్కజొన్న: "maize", టమాటా: "tomato", బియ్యం: "rice", ఉల్లి: "onion",
  मक्का: "maize", टमाटर: "tomato", चावल: "rice", प्याज: "onion",
  corn: "maize", tomatoes: "tomato", onions: "onion", paddy: "rice",
};

export function parseIntent(rawText: string): VoiceIntent {
  const text = rawText.toLowerCase().trim();
  const crop = findCrop(text);
  const quantity = findQuantity(text);

  if (/(help|stuck|సహాయ|मदद)/.test(text)) return { kind: "help" };
  if (/(damag|broken|complain|problem|rotten|खराब|సమస్య)/.test(text)) return { kind: "complaint" };
  if (/(where is my order|order status|my order|track|ఆర్డర్ ఎక్కడ)/.test(text)) return { kind: "orderStatus" };
  if (/(earn|income|ఆదాయ|कमाई)/.test(text)) return { kind: "earnings" };
  if (/(add crop|post crop|sell|list my|పంట చేర|फसल जोड)/.test(text)) return { kind: "addCrop" };
  if (/(cart|basket|కార్ట|कार्ट)/.test(text)) return { kind: "cart" };
  if (/(order|buy|kharid|కొను|खरीद)/.test(text)) return { kind: "order", crop, quantity };
  if (/(show|search|find|near me|చూప|दिखा|खोज)/.test(text)) return { kind: "search", crop };
  if (/(home|main|హోమ్|होम)/.test(text)) return { kind: "home" };
  if (crop) return { kind: "search", crop };
  return { kind: "unknown", text: rawText };
}

function findCrop(text: string): string | undefined {
  for (const [alias, crop] of Object.entries(CROP_ALIASES)) {
    if (text.includes(alias.toLowerCase())) return crop;
  }
  return KNOWN_CROPS.find((c) => text.includes(c));
}

function findQuantity(text: string): number | undefined {
  const digits = text.match(/(\d+(?:\.\d+)?)/);
  if (digits?.[1]) return Number(digits[1]);
  for (const [word, value] of Object.entries(WORD_NUMBERS)) {
    if (new RegExp(`\\b${word}\\b`).test(text)) return value;
  }
  return undefined;
}

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
