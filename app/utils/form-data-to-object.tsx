import { set } from "lodash";

export function formDataToObject(formData: FormData) {
  const result: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    set(result, key, value);
  }
  return result;
}
