import { effect } from "@preact/signals";
import { motion, useAnimationControls } from "framer-motion";

import type { CommandID, ContentForm, GetQueryFn } from "types/builder.ts";
import { focusedCommand, queryMap, updateQuery } from "utils/signals.ts";

import { IconChevronRight } from "utils/icons.ts";
import { TextInput } from "components/TextInput.tsx";
import { Select } from "components/Select.tsx";
import { Calendar } from "components/Calendar.tsx";

type CommandProps = {
  id: CommandID;
  title?: string;
  noColon?: boolean;
  desc?: string;
  hint: string;
  onToggle: (a: boolean) => void;
  form: ContentForm;
};

export const Command = (
  {
    id,
    title,
    noColon = false,
    desc,
    hint,
    onToggle,
    form,
  }: CommandProps,
) => {
  const controls = useAnimationControls();

  effect(() => {
    const isOpen = focusedCommand.value === id;
    controls.start({
      height: isOpen ? "100%" : "0px",
    });
  });

  const handleFocusCommand = () => {
    focusedCommand.value = id;
  };

  return (
    <div class="group" onClick={handleFocusCommand}>
      <div class="flex items-center w-full">
        <Checkbox
          checked={queryMap.value.get(id)?.active}
          onClick={(checked) => onToggle(checked)}
        />
        <div class="flex flex-1">
          <div class="flex-1 flex flex-col px-1">
            <CommandLabel id={id} title={title} noColon={noColon} desc={desc} />
            <CommandUnderline />
          </div>
          <CommandForm {...form} />
        </div>
      </div>
      <motion.div
        className="overflow-hidden w-full h-[1px] pt-[1px]"
        animate={controls}
        transition={{
          duration: 0.3,
          ease: [0.04, 0.62, 0.23, 0.98],
        }}
      >
        <Hint hint={hint} />
      </motion.div>
    </div>
  );
};

type CheckBoxProps = {
  checked?: boolean;
  onClick: (checked: boolean) => void;
};

const Checkbox = ({ checked, onClick }: CheckBoxProps) => {
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

type LabelProps = Pick<CommandProps, "id" | "title" | "noColon" | "desc">;

const CommandLabel = ({ id, title, noColon, desc }: LabelProps) => {
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

const CommandUnderline = () => {
  return (
    <span class="bg(twitter) h-[1px] w-0 group-hover:!w-full transition-all sm:duration-300" />
  );
};

const CommandForm = (props: ContentForm) => {
  const { type } = props;

  if (type === "input") {
    const { id } = props;
    const getQuery: GetQueryFn = props.getQuery ?? ((v) => `${id}:${v.trim()}`);

    return (
      <TextInput
        placeholder={props.placeholder}
        onInput={(v) => updateQuery({ id, query: getQuery(v) })}
      />
    );
  }

  if (type === "input:disabled") {
    return (
      <input
        class="px-2 w-[12rem] text-gray-800 border-2 rounded outline-none disabled:(cursor-not-allowed)"
        type="text"
        value={props.value}
        disabled
      />
    );
  }

  if (type === "select") {
    const { id } = props;
    const getQuery: GetQueryFn = props.getQuery ?? ((v) => `${id}:${v.trim()}`);

    return (
      <Select
        id={id}
        onChange={(v) => updateQuery({ id, query: getQuery(v) })}
      />
    );
  }

  if (type === "calendar") {
    return <Calendar id={props.calendarId} />;
  }

  return null;
};

const Hint = ({ hint }: { hint: string }) => {
  return (
    <div class="flex w-full bg-gray-100 text-gray-600 rounded">
      <IconChevronRight size={24} />
      <div class="flex-1">
        <span class="text-sm">{hint}</span>
      </div>
    </div>
  );
};
