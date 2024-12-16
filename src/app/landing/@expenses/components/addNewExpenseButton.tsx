
interface AddNewExpenseButtonProps {
  onClick: () => void;
}

const AddNewExpenseButton: React.FC<AddNewExpenseButtonProps> = ({ onClick }) => {
  return (
    <button className="self-center pt-4" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8 stroke-textColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  );
};

export default AddNewExpenseButton;
