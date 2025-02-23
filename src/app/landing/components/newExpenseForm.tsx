import { Field, Input } from "@headlessui/react";
import SubmitButton from "./submitButton";
import { z } from "zod";
import { useState } from "react";

interface NewExpenseFormProps {
  onSave: (formData: FormData) => void;
}

const expenseFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a valid positive number"
  ),
});

const getFieldData = () => ({
  description: {
    schema: expenseFormSchema.shape.description,
    getValue: (formData: FormData) => formData.get("description") as string
  },
  category: {
    schema: expenseFormSchema.shape.category,
    getValue: (formData: FormData) => formData.get("category") as string
  },
  amount: {
    schema: expenseFormSchema.shape.amount,
    getValue: (formData: FormData) => formData.get("amount") as string
  }
});

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onSave }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    const fieldData = getFieldData();
    const field = fieldData[name as keyof typeof fieldData];

    if (!field) return;

    const result = field.schema.safeParse(value);
    setErrors(prev => ({
      ...prev,
      [name]: !result.success ? result.error.issues[0].message : ""
    }));
  };

  return (
    <form
      className="flex gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fieldData = getFieldData();
        const data = Object.entries(fieldData).reduce((acc, [key, field]) => ({
          ...acc,
          [key]: field.getValue(formData)
        }), {});

        const result = expenseFormSchema.safeParse(data);
        if (!result.success) {
          const formattedErrors: { [key: string]: string } = {};
          result.error.issues.forEach((issue) => {
            formattedErrors[issue.path[0]] = issue.message;
          });
          setErrors(formattedErrors);
          return;
        }

        setErrors({});
        onSave(formData);
      }}>
      <Field>
        <Input
          required
          id="description"
          name="description"
          placeholder="Description"
          onChange={(e) => validateField("description", e.target.value)}
          className={`bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 border-r-[1px] ${errors.description ? "border-red-500" : "border-neutralBackgroundColorInverted"}`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </Field>
      <Field>
        <Input
          required
          id="category"
          name="category"
          placeholder="Category"
          onChange={(e) => validateField("category", e.target.value)}
          className={`bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 border-r-[1px] ${errors.category ? "border-red-500" : "border-neutralBackgroundColorInverted"}`}
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>)}
      </Field>
      <Field className="flex gap-2 items-baseline justify-center">
        <p className=" select-none text-2xl text-neutralBackgroundColorInverted">
          $
        </p>
        <Input
          required
          id="amount"
          name="amount"
          placeholder="Amount"
          type="text"
          inputMode="decimal"
          onChange={(e) => validateField("amount", e.target.value)}
          className={`bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 ${errors.amount ? "border-red-500" : ""}`}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </Field>
      <SubmitButton />
    </form>
  );
};

export default NewExpenseForm;
