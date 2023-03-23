import { useCallback, useState } from "react";

export function useToggle(defaultValue: boolean = false) {
  const [value, setValue] = useState(defaultValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const close = useCallback(() => setValue(false), []);
  return [value, { toggle, close }] as const;
}
