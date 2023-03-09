import { COMMAND_IDS } from "consts/builder.ts";

export type CommandID = keyof typeof COMMAND_IDS;

export type GetQueryFn = (value: string) => string;

export type CalendarID = "until" | "since";

export type SelectID = Extract<
  CommandID,
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
  calendarId: CalendarID;
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
