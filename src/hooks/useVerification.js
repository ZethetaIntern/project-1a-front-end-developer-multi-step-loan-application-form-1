import { useState } from "react";

export default function useVerification() {
  const [loadingField, setLoadingField] = useState("");

  async function verify(field, isValid, onSuccess, onFailure) {
    if (!isValid) {
      onFailure?.();
      return;
    }
    setLoadingField(field);
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    onSuccess?.();
    setLoadingField("");
  }

  return { loadingField, verify };
}
