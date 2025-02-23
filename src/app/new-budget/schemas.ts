import { z } from "zod";

export const budgetFormSchema = z.object({
    projectName: z.string().min(1, "Project name is required"),
    budget: z.string().transform((val) => Number.parseFloat(val)),
    description: z.string().optional(),
    dailyBudget: z.string().transform((val) => Number.parseFloat(val)),
    total_expenses: z.number().default(0)
  });