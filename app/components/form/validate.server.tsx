import type { Validator } from "remix-validated-form";
import { validationError } from "remix-validated-form";

export async function validate<DataType>({
  request,
  validator,
}: {
  request: Request;
  validator: Validator<DataType>;
}) {
  const data = await validator.validate(await request.formData());
  if (data.error) throw validationError(data.error);
  return data.data;
}
