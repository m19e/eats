import { IconChevronRight } from "/utils/icons.ts";

type Props = { hint: string };

export const Hint = ({ hint }: Props) => {
  return (
    <div class="flex w-full bg-gray-100 text-gray-600 rounded">
      <IconChevronRight size={24} />
      <div class="flex-1">
        <span class="text-sm">{hint}</span>
      </div>
    </div>
  );
};
