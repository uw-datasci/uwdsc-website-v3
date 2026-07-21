import { z } from "zod";

export const addPositionSchema = z.object({
  positionId: z.number().int().positive(),
});

export type AddPositionFormValues = z.infer<typeof addPositionSchema>;
