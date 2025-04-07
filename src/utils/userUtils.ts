import { z } from "zod";

// Project constants
export const DEFAULT_PROJECT = 'project:viaje-europa-2024';

// Validate auth session structure
export const AuthUserSchema = z.object({
  user: z.object({
    name: z.string().optional(),
    email: z.string().email(),
    image: z.string().url().optional()
  }),
  expires: z.string().datetime()
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

// Generate user-specific keys
export const getUserProjectKey = (userEmail: string, projectName: string) => 
  `user:${userEmail}:${projectName}`;

export const getUserExpensesKey = (userEmail: string, projectName: string) => 
  `user:${userEmail}:${projectName}:expenses`;

export const getUserExpenseKey = (userEmail: string, dateScore: string, expenseNumber: string) => 
  `user:${userEmail}:expense:${dateScore}${expenseNumber}`;

export const getUserCategoriesKey = (userEmail: string) => 
  `user:${userEmail}:categories`;

export const getUserProjectsKey = (userEmail: string) => 
  `user:${userEmail}:projects`;

// Helper function to sanitize email for use in Redis keys
export const sanitizeEmail = (email: string): string => {
  return email.replace(/[^a-zA-Z0-9]/g, "_");
}; 