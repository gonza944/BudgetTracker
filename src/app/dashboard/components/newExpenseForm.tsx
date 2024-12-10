import { Field, Label, Description, Input } from "@headlessui/react";

interface NewExpenseFormProps {
  onSave: (formData: FormData) => void;
}

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onSave }) => (
  <form className="flex gap-4" action={onSave}>
    <Field>
      <Input
        id="description"
        name="description"
        placeholder="Description"
        className="bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 border-r-[1px] border-neutralBackgroundColorInverted"
      />
    </Field>
    <Field>
      <Input
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
        id="amount"
        name="amount"
        placeholder="Amount"
        type="number"
        className=" bg-neutralBackgroundColor mt-3 block w-full text-2xl text-neutralBackgroundColorInverted focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
      />
    </Field>
    <button type="submit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8 stroke-primaryColor mt-3">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  </form>
);

export default NewExpenseForm;
