import { getUserProjectKey } from "@/utils/userUtils";
import { Redis } from "@upstash/redis";
import { budgetFormSchema } from "./schemas";

const redis = Redis.fromEnv();

export const createNewBudget = async (formData: FormData) => {
  try {
    const rawFormData = budgetFormSchema.parse({
      projectName: formData.get("project-name") as string,
      budget: formData.get("budget"),
      description: formData.get("description"),
      dailyBudget: formData.get("dailyBudget"),
      userEmail: formData.get("userEmail"),
      total_expenses: 0,
    });

    const projectName = rawFormData.projectName.replace(" ", "-");
    const projectId = `project:${projectName}`;
    const userProjectKey = getUserProjectKey(rawFormData.userEmail, projectId);

    console.log("rawFormData", rawFormData);
    console.log("userProjectKey", userProjectKey);
    // Store project data
    await redis.hset(userProjectKey, rawFormData);
  } catch (error) {
    console.log(error);
  }
};
