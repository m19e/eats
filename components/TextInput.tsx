import { IS_BROWSER } from "$fresh/runtime.ts";

type Props = {
  placeholder: string;
  onInput: (value: string) => void;
  disabled?: boolean;
};

export const TextInput = ({ placeholder, onInput, disabled }: Props) => {
  return (
    <input
      class="px-2 m-[1px] focus:m-0 min-w-[12rem] rounded border focus:border(twitter 2) outline-none"
      type="text"
      placeholder={placeholder}
      onInput={(e) => onInput(e.currentTarget.value)}
      disabled={!IS_BROWSER || disabled}
    />
  );
};
