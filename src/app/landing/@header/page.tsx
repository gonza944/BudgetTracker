import { initialState } from "@/app/providers/generalReducer";
import { getProject } from "../@expenses/dashboardActions";

export default async function HeaderPage() {
  const project = await getProject(initialState.currentProject);
  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col items-start justify-start">
      <h1 className="font-title text-[11vw]">{project.projectName.toUpperCase()}</h1>
    </div>
  );
}
