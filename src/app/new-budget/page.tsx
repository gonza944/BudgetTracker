"use client";

import { useState } from "react";
import { createNewBudget } from "./budgetActions";
import { budgetFormSchema } from "./schemas";

const getFieldData = () => ({
  projectName: {
    schema: budgetFormSchema.shape.projectName,
    getValue: (formData: FormData) => formData.get("projectName") as string
  },
  budget: {
    schema: budgetFormSchema.shape.budget,
    getValue: (formData: FormData) => formData.get("budget") as string
  },
  description: {
    schema: budgetFormSchema.shape.description,
    getValue: (formData: FormData) => formData.get("description") as string
  },
  dailyBudget: {
    schema: budgetFormSchema.shape.dailyBudget,
    getValue: (formData: FormData) => formData.get("dailyBudget") as string
  },
  total_expenses: {
    schema: budgetFormSchema.shape.total_expenses,
    getValue: (formData: FormData) => formData.get("total_expenses") as string
  }
});

const NewBudgetPage: React.FC = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    const fieldData = getFieldData();
    const field = fieldData[name as keyof typeof fieldData];
    if (!field) return;
    const result = field.schema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: !result.success ? result.error.issues[0].message : "",
    }));
  };

  return (
    <form action={createNewBudget}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-5xl font-title font-semibold text-neutralBackgroundColorInverted">
            New Budget
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="project-name"
                className="block text-sm/6 font-medium text-gray-900">
                Project Name
              </label>
              <div className="mt-2">
                <input
                  id="project-name"
                  name="project-name"
                  type="text"
                  onBlur={(e) => validateField("projectName", e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="budget"
                className="block text-sm/6 font-medium text-gray-900">
                Budget
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                    $
                  </div>
                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    placeholder="0.00"
                    onBlur={(e) => validateField("budget", e.target.value)}
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  />
                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="dailyBudget"
                className="block text-sm/6 font-medium text-gray-900">
                Daily Budget
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                  <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                    $
                  </div>
                  <input
                    id="dailyBudget"
                    name="dailyBudget"
                    type="text"
                    placeholder="0.00"
                    onBlur={(e) => validateField("dailyBudget", e.target.value)}
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  />
                  {errors.dailyBudget && (
                    <p className="text-red-500 text-sm mt-1">{errors.dailyBudget}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  onBlur={(e) => validateField("description", e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-accentColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </form>
  );
};

export default NewBudgetPage;
