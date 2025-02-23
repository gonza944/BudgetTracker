import { Redis } from "@upstash/redis";
import { budgetFormSchema } from "./schemas";


export const createNewBudget = async (formData: FormData) => {
    try {
        const rawFormData = budgetFormSchema.parse({
            projectName: formData.get("project-name") as string,
            budget: formData.get("budget"),
            description: formData.get("description"),
            dailyBudget: formData.get("dailyBudget"),
            total_expenses: 0,
        });

        const redis = Redis.fromEnv();
        const projectId = `project:${rawFormData.projectName.replace(
            " ",
            "-"
        )}`;
        await redis.hset(projectId, rawFormData);
    } catch (error) {
        console.log(error);
    }
};