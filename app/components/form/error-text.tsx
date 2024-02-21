import { Box } from "@chakra-ui/react";
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
    <Box color="red.500">
      {Object.entries(fieldErrors).map(([key, value]) => (
        <Box key={key}>
          {key}: {value}
        </Box>
      ))}
    </Box>
  );
}
