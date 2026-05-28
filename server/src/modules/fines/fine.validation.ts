import { z } from "zod";

export const payFineSchema = z.object({
  body: z.object({
    fine_id: z.uuid(),
  }),
});