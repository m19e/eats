import { computed, signal } from "@preact/signals";

import type { CommandID } from "/types/builder.ts";

type QueryData = {
  id: CommandID;
  query: string;
  active: boolean;
};
type UpdateQueryData = Omit<QueryData, "active"> & Partial<QueryData>;

const defaultQueries: UpdateQueryData[] = [
  { id: "keywords", query: "" },
  { id: "exact", query: `""` },
  { id: "or", query: "" },
  { id: "minus", query: "-" },
  { id: "tag", query: "#" },
  { id: "exclude_name", query: "OR @i -@i", active: true },
  { id: "from", query: "from:" },
  { id: "to", query: "to" },
  { id: "filter:follows", query: "filter:follows" },
  { id: "filter:media", query: "filter:images" },
  { id: "filter:tweet", query: "filter:nativeretweets" },
  { id: "lang", query: "lang:ja" },
  { id: "until", query: "until:2023-1-1" },
  { id: "since", query: "since:2023-1-1" },
  { id: "min_retweets", query: "min_retweets:0" },
  { id: "min_faves", query: "min_faves:0" },
  { id: "min_replies", query: "min_replies:0" },
];

const createQueryTuple = (
  data: UpdateQueryData,
): [CommandID, QueryData] => [data.id, { active: false, ...data }];

export const queryMap = signal(
  new Map<CommandID, QueryData>(defaultQueries.map(createQueryTuple)),
);

export const queryString = computed(() => {
  return [...queryMap.value.values()]
    .filter((q) => q.active && q.query.trim())
    .map((q) => q.query).join(" ");
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

export const focusedCommand = signal<CommandID | undefined>(undefined);
