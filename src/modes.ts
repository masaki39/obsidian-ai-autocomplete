// A "mode" is just an editable system prompt with a name. Switching modes only
// changes the instruction sent to the model; the line-level pipeline (extract
// current line -> strip markdown prefix -> transform -> preview below) is shared.

export interface Mode {
  id: string;
  name: string;
  prompt: string;
  // Only meaningful when the prompt contains the {targetLang} placeholder.
  targetLang?: string;
}

export const DEFAULT_MODES: Mode[] = [
  {
    id: "proofread",
    name: "Proofread",
    prompt:
      "You are a proofreader. Fix spelling, grammar, punctuation and typos, and make the wording read naturally. Keep the SAME language and the SAME meaning; do not add or remove information. Output ONLY the corrected text, with no quotes and no explanation.",
  },
  {
    id: "translate",
    name: "Translate",
    prompt:
      "Translate the text into {targetLang}. Keep the meaning faithful and natural. Output ONLY the translation, with no quotes and no explanation.",
  },
];

// Resolve a mode's prompt for a request, substituting {targetLang} from the
// mode's own setting (falling back to a global default).
export function buildModePrompt(mode: Mode, fallbackTargetLang: string): string {
  const lang = (mode.targetLang || fallbackTargetLang || "English").trim();
  return mode.prompt.replace(/\{targetLang\}/g, lang);
}

// Markdown decoration that should NOT be sent to the model and must be preserved
// on the line: indentation + an optional block marker (quote, heading, list,
// ordered list, task checkbox). Generalizes the old stripRedundantListMarker.
const LINE_PREFIX_RE =
  /^(\s*(?:>\s?)*(?:#{1,6}\s+|(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?)?)(.*)$/;

export function stripLinePrefix(line: string): {
  prefix: string;
  content: string;
} {
  const match = LINE_PREFIX_RE.exec(line);
  if (!match) return { prefix: "", content: line };
  return { prefix: match[1], content: match[2] };
}
