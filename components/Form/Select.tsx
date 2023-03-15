import { OPTIONS_MAP } from "/consts/builder.ts";
import type { SelectID } from "/types/builder.ts";

type Props = {
  id: SelectID;
  onChange: (value: string) => void;
};

export const Select = ({ id, onChange }: Props) => {
  const options = OPTIONS_MAP[id].map(({ value, label }) => (
    <option key={value} value={value}>{label}</option>
  ));

  return (
    <select
      class="px-1 min-w-[12rem] rounded border-2 focus:border(twitter) outline-none"
      defaultValue={OPTIONS_MAP[id][0].value}
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {options}
    </select>
  );
};
