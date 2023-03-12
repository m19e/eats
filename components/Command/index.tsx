import { effect } from "@preact/signals";
import { motion, useAnimationControls } from "framer-motion";

import type {
  CommandData,
  CommandForm,
  CommandID,
  GetQueryFn,
} from "/types/builder.ts";
import {
  focusedCommand,
  queryMap,
  toggleQuery,
  updateQuery,
} from "/utils/signals.ts";

import { TextInput } from "/components/TextInput.tsx";
import { Select } from "/components/Select.tsx";
import { Calendar } from "/components/Calendar.tsx";

import { Hint } from "/components/Command/Hint.tsx";

export const Command = (
  {
    id,
    title,
    noColon = false,
    desc,
    hint,
    defaultQuery,
    form,
  }: CommandData,
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
          onClick={(active) => toggleQuery({ id, active, query: defaultQuery })}
        />
        <div class="flex flex-1">
          <div class="flex-1 flex flex-col px-1">
            <Label id={id} title={title} noColon={noColon} desc={desc} />
            <Underline />
          </div>
          <Form {...form} />
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

type LabelProps = Pick<CommandData, "id" | "title" | "noColon" | "desc">;

const Label = ({ id, title, noColon, desc }: LabelProps) => {
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

const Underline = () => {
  return (
    <span class="bg(twitter) h-[1px] w-0 group-hover:!w-full transition-all sm:duration-300" />
  );
};

const getHandler = (props: { id: CommandID; getQuery?: GetQueryFn }) => {
  const { id } = props;

  const getQuery: GetQueryFn = props.getQuery ??
    ((v) => `${id}:${v.trim()}`);
  const handler = (v: string) => updateQuery({ id, query: getQuery(v) });

  return handler;
};

const Form = (props: CommandForm) => {
  const { type } = props;

  if (type === "calendar") {
    return <Calendar id={props.id} />;
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

  const { id, getQuery } = props;
  const handler = getHandler({ id, getQuery });

  if (type === "input") {
    return (
      <TextInput
        placeholder={props.placeholder}
        onInput={handler}
      />
    );
  }
  if (type === "select") {
    return (
      <Select
        id={props.id}
        onChange={handler}
      />
    );
  }

  return null;
};
