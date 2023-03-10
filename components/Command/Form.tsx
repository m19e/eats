import type {
  CommandForm,
  CommandFormWithGetQuery,
  GetQueryFn,
} from "/types/builder.ts";
import { updateQuery } from "/utils/signals.ts";

import { TextInput } from "/components/Form/TextInput.tsx";
import { Select } from "/components/Form/Select.tsx";
import { Calendar } from "/components/Form/Calendar.tsx";

const getHandler = (
  props: Pick<CommandFormWithGetQuery, "id" | "getQuery">,
) => {
  const { id } = props;

  const getQuery: GetQueryFn = props.getQuery ??
    ((v) => `${id}:${v.trim()}`);
  const handler = (v: string) => updateQuery({ id, query: getQuery(v) });

  return handler;
};

export const Form = (props: CommandForm) => {
  const { type } = props;

  if (type === "calendar") {
    return <Calendar id={props.id} />;
  }
  if (type === "input:disabled") {
    return <InputDisabled value={props.value} />;
  }

  return <FormWithQuery {...props} />;
};

const InputDisabled = ({ value }: { value: string }) => {
  return (
    <input
      class="px-2 w-[12rem] text-gray-800 border-2 rounded outline-none disabled:(cursor-not-allowed)"
      type="text"
      value={value}
      disabled
    />
  );
};

const FormWithQuery = (props: CommandFormWithGetQuery) => {
  const { type, id, getQuery } = props;
  const handler = getHandler({ id, getQuery });

  if (type === "select") {
    return <Select id={props.id} onChange={handler} />;
  }

  return <TextInput placeholder={props.placeholder} onInput={handler} />;
};
