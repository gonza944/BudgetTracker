"use client";

import { useProjectStore } from "@/app/store/projectStore";

export default function HeaderPage() {
  const { project } = useProjectStore();


  if (!project) {
    return null;
  }

  const remainingBudget = project.budget - project.total_expenses;

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-title text-5xl">Overall Balance</h1>
      <h2
        className={`font-title text-7xl ${remainingBudget >= 0
          ? "text-primaryColor"
          : "text-secondaryAccentColor"
          } m-4`}>
        $ {remainingBudget.toFixed(2)}
      </h2>
    </div>
  );
}
