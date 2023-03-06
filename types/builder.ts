const COMMAND_IDS = {
  keywords: "KEYWORDS",
  exact: "EXACT",
  or: "OR",
  minus: "MINUS",
  tag: "TAG",
  from: "FROM",
  to: "TO",
  until: "UNTIL",
  since: "SINCE",
  min_retweets: "MIN_RETWEETS",
  min_faves: "MIN_FAVES",
  min_replies: "MIN_REPLIES",
  "filter:follows": "FILTER:FOLLOWS",
  "filter:media": "FILTER:MEDIA",
  "filter:tweet": "FILTER:TWEET",
  lang: "LANG",
} as const;
export type CommandID = keyof typeof COMMAND_IDS;

export type GetQueryFn = (value: string) => string;

export type CalendarID = "until" | "since";

export type SelectID = Extract<
  CommandID,
  "lang" | "filter:media" | "filter:tweet"
>;

export type ContentForm = {
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

type GroupContent = { type: "group"; title: string };
type CommandContent = {
  type: "command";
  id: CommandID;
  title?: string;
  noColon?: boolean;
  desc?: string;
  hint: string;
  defaultQuery: string;
  form: ContentForm;
};

export type Content = GroupContent | CommandContent;
