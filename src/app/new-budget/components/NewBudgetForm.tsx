"use client";

import { useState, useEffect } from "react";
import { createNewBudget } from "../budgetActions";
import { budgetFormSchema } from "../schemas";

interface NewBudgetFormProps {
  email: string;
}

interface FormValues {
  projectName: string;
  budget: string;
  description: string;
  dailyBudget: string;
  total_expenses: number;
  userEmail: string;
}

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
  userEmail: {
    schema: budgetFormSchema.shape.userEmail,
    getValue: (formData: FormData) => formData.get("userEmail") as string
  }
});

const NewBudgetForm: React.FC<NewBudgetFormProps> = ({ email }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formValues, setFormValues] = useState<FormValues>({
    projectName: "",
    budget: "",
    description: "",
    dailyBudget: "",
    total_expenses: 0,
    userEmail: email,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (name: string, value: string) => {
    const fieldData = getFieldData();
    const field = fieldData[name as keyof typeof fieldData];
    if (!field) return;
    const result = field.schema.safeParse(value);
    const newError = !result.success ? result.error.issues[0].message : "";
    
    setErrors((prev) => ({
      ...prev,
      [name]: newError,
    }));

    return !newError;
  };

  const validateForm = (newValues: Partial<FormValues> = {}) => {
    const currentValues = { ...formValues, ...newValues };
    const result = budgetFormSchema.safeParse(currentValues);

    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
    }
    
    setIsFormValid(result.success);
    return result.success;
  };

  const handleInputChange = (name: keyof FormValues, value: string) => {
    setFormValues((prev) => {
      const newValues = { ...prev, [name]: value };
      validateField(name, value);
      validateForm(newValues);
      return newValues;
    });
    validateForm({[name]: value});
  };

  return (
    <form action={createNewBudget}>
      <input type="hidden" name="userEmail" id="userEmail" value={email} />
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
                  value={formValues.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
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
                    value={formValues.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  />
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
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
                    value={formValues.dailyBudget}
                    onChange={(e) => handleInputChange("dailyBudget", e.target.value)}
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  />
                </div>
                {errors.dailyBudget && (
                  <p className="text-red-500 text-sm mt-1">{errors.dailyBudget}</p>
                )}
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
                  value={formValues.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
          disabled={!isFormValid}
          className="rounded-md bg-accentColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
          Save
        </button>
      </div>
    </form>
  );
};

export default NewBudgetForm; 