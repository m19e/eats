import { computed, signal } from "@preact/signals";

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
} as const;

export type CommandID = keyof typeof COMMAND_IDS;
type QueryData = {
  id: CommandID;
  query: string;
  active: boolean;
};
type UpdateQueryData = Omit<QueryData, "active"> & Partial<QueryData>;

export const isExcludeUser = signal(true);

export const queryMap = signal(new Map<CommandID, QueryData>());

export const queryString = computed(() => {
  return [...queryMap.value.values()].filter((q) => q.active).map((q) =>
    q.query
  ).join(" ") + (isExcludeUser.value ? " OR @i -@i" : "");
});

export const updateQuery = (
  { id, query, active = true }: UpdateQueryData,
) => {
  queryMap.value = new Map(queryMap.value.set(id, { id, query, active }));
};

export const toggleQuery = (data: QueryData) => {
  const { id, active } = data;
  const prevQuery = queryMap.value.get(id) ?? data;
  updateQuery({ ...prevQuery, active });
};
