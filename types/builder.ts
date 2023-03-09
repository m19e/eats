import { COMMAND_IDS } from "consts/builder.ts";

export type CommandID = keyof typeof COMMAND_IDS;

export type GetQueryFn = (value: string) => string;

export type CalendarID = keyof Pick<
  typeof COMMAND_IDS,
  "until" | "since"
>;

export type SelectID = keyof Pick<
  typeof COMMAND_IDS,
  "lang" | "filter:media" | "filter:tweet"
>;

export type CommandForm = {
  type: "input";
  id: CommandID;
  placeholder: string;
  getQuery?: GetQueryFn;
} | {
  type: "input:disabled";
  value: string;
} | {
  type: "select";
  id: SelectID;
  getQuery?: GetQueryFn;
} | {
  type: "calendar";
  id: CalendarID;
};

export type CommandData = {
  id: CommandID;
  title?: string;
  noColon?: boolean;
  desc?: string;
  hint: string;
  defaultQuery: string;
  form: CommandForm;
};

export type CategoryData = {
  title: string;
  commands: CommandData[];
};
