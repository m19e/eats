type CheckboxProps = {
  checked?: boolean;
  onClick: (checked: boolean) => void;
};

export const Checkbox = ({ checked, onClick }: CheckboxProps) => {
  return (
    <div
      class={`flex items-center justify-center w-5 h-5 rounded-full cursor-pointer ${
        checked ? "bg(twitter)" : "border-2 border-gray-600"
      }`}
      onClick={() => onClick(!checked)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5 text-white"
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};
