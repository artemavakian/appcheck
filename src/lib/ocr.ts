import { TRIGGER_WORDS } from "./types";

export async function extractTextFromImage(imageDataUrl: string): Promise<string> {
  if (typeof window === "undefined") return "";

  const Tesseract = await import("tesseract.js");
  const { data: { text } } = await Tesseract.recognize(imageDataUrl, "eng");
  return text;
}

export function scanForTriggerWords(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();

  for (const word of TRIGGER_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      found.push(word);
    }
  }

  return Array.from(new Set(found));
}

export async function processScreenshots(
  screenshots: string[]
): Promise<string[]> {
  const allWords: string[] = [];

  for (const screenshot of screenshots) {
    try {
      const text = await extractTextFromImage(screenshot);
      const words = scanForTriggerWords(text);
      allWords.push(...words);
    } catch {
      console.error("OCR processing failed for a screenshot");
    }
  }

  return Array.from(new Set(allWords));
}
