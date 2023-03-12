import { effect } from "@preact/signals";
import { motion, useAnimationControls } from "framer-motion";

import type { CommandData } from "/types/builder.ts";
import { focusedCommand, queryMap, toggleQuery } from "/utils/signals.ts";

import { Checkbox } from "/components/Command/Checkbox.tsx";
import { Label } from "/components/Command/Label.tsx";
import { Form } from "/components/Command/Form.tsx";
import { Hint } from "/components/Command/Hint.tsx";
import { Underline } from "/components/Command/Underline.tsx";

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
