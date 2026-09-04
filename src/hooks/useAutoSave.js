import { useEffect, useRef, useState } from "react";
import { saveDraft } from "../utils/storage.js";

export default function useAutoSave(formData, currentStep, interval = 30000) {
  const timer = useRef(null);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveDraft({ currentStep, formData });
      setSavedAt(new Date());
    }, interval);
    return () => clearTimeout(timer.current);
  }, [formData, currentStep, interval]);

  return savedAt;
}
