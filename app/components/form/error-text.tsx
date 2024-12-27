import { useEffect } from "react";
import { useFormContext } from "remix-validated-form";

export function ErrorText() {
  const { fieldErrors } = useFormContext();

  useEffect(() => {
    if (Object.keys(fieldErrors).length) {
      console.log(fieldErrors);
    }
  }, [fieldErrors]);

  if (!Object.keys(fieldErrors).length) {
    return null;
  }

  return (
    <div className="text-red-500">
      {Object.entries(fieldErrors).map(([key, value]) => (
        <div key={key}>
          {key}: {value}
        </div>
      ))}
    </div>
  );
}
