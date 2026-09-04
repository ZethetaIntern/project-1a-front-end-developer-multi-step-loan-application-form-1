import { DRAFT_KEY, DRAFT_TTL_MS, DRAFT_VERSION } from "./constants.js";

export function saveDraft({ currentStep, formData }) {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      currentStep,
      formData,
    }),
  );
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const age = Date.now() - new Date(draft.savedAt).getTime();
    if (draft.version !== DRAFT_VERSION || !draft.formData || age > DRAFT_TTL_MS) {
      clearDraft();
      return null;
    }
    return draft;
  } catch (_error) {
    clearDraft();
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
