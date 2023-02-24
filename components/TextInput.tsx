import { IS_BROWSER } from "$fresh/runtime.ts";

type Props = {
  placeholder: string;
  onInput: (value: string) => void;
  disabled?: boolean;
};

export const TextInput = ({ placeholder, onInput, disabled }: Props) => {
  return (
    <input
      class="border px-2 min-w-[12rem]"
      type="text"
      placeholder={placeholder}
      onInput={(e) => onInput(e.currentTarget.value)}
      disabled={!IS_BROWSER || disabled}
    />
  );
};
