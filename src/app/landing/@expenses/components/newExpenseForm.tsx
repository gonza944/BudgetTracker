import { Field, Input } from "@headlessui/react";
import SubmitButton from "./submitButton";

interface NewExpenseFormProps {
  onSave: (formData: FormData) => void;
}

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onSave }) => {
  return (
    <form className="flex gap-4" action={onSave}>
      <Field>
        <Input
          required
          id="description"
          name="description"
          placeholder="Description"
          className="bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 border-r-[1px] border-neutralBackgroundColorInverted"
        />
      </Field>
      <Field>
        <Input
          required
          id="category"
          name="category"
          placeholder="Category"
          className=" bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 border-r-[1px] border-neutralBackgroundColorInverted"
        />
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
          type="number"
          step="0.01"
          className=" bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
        />
      </Field>
      <SubmitButton />
    </form>
  );
};

export default NewExpenseForm;
