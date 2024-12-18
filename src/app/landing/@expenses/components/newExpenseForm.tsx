import { Field, Input } from "@headlessui/react";
import SubmitButton from "./submitButton";

interface NewExpenseFormProps {
  onSave: (formData: FormData) => void;
}

const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onSave }) => {
  return (
    <form className="flex flex-col w-full" action={onSave}>
      <div className="flex items-stretch justify-between">
        <Field>
          <Input
            required
            id="description"
            name="description"
            placeholder="Description"
            className="bg-backgroundColor text-lg leading-tight text-textColor focus:outline-none"
          />
        </Field>
        <Field className="flex">
          <p className="select-none text-lg leading-tight text-textColor">$</p>
          <Input
            required
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            className="bg-backgroundColor appearance-none text-lg leading-tight text-textColor focus:outline-none"
          />
        </Field>
      </div>
    {/*   <Field>
        <Input
          required
          id="category"
          name="category"
          placeholder="Category"
          className=" bg-backgroundColor mt-3 block text-lg leading-tight text-textColor focus:outline-none"
        />
      </Field> */}
      <SubmitButton />
    </form>
  );
};

export default NewExpenseForm;
