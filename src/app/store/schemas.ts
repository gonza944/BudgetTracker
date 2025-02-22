import { z } from "zod";

export const createNewExpenseSchema = z.object({
    description: z.string().optional(),
    category: z.string().optional(),
    amount: z.string().transform((val) => Number.parseFloat(val)),
  });