import { useEffect, useState } from "react";
import { PINCODE_DATA } from "../utils/pincodeData.js";

export default function usePinCodeLookup(pin, onFound) {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!/^[0-9]{6}$/.test(pin || "")) {
      setStatus(pin ? "invalid" : "idle");
      return undefined;
    }
    setStatus("loading");
    const timer = setTimeout(() => {
      const result = PINCODE_DATA[pin];
      if (result) {
        onFound(result);
        setStatus("found");
      } else {
        setStatus("missing");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pin, onFound]);

  return status;
}
