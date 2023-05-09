import { z } from "zod";

export const exercises = z.object({ exercises: z.array(z.string()) });
