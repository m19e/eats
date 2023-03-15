import type { CommandData } from "/types/builder.ts";

type LabelProps = Pick<CommandData, "id" | "title" | "noColon" | "desc">;

export const Label = ({ id, title, noColon, desc }: LabelProps) => {
  return (
    <p class="px-1 text-gray-800 group-hover:font-medium group-hover:text(twitter) transition-colors sm:duration-300">
      {title ?? id}
      {!noColon && ":"}
      {desc &&
        (
          <span class="hidden sm:inline text-gray-800 text-opacity-50 group-hover:text(twitter opacity-50) px-1 text-sm">
            {desc}
          </span>
        )}
    </p>
  );
};
