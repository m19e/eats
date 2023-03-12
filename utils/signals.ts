import { computed, signal } from "@preact/signals";

import type { CommandID } from "/types/builder.ts";

type QueryData = {
  id: CommandID;
  query: string;
  active: boolean;
};
type UpdateQueryData = Omit<QueryData, "active"> & Partial<QueryData>;

const defaultQueries: QueryData[] = [
  { id: "keywords", query: "", active: false },
  { id: "exact", query: `""`, active: false },
  { id: "or", query: "", active: false },
  { id: "minus", query: "-", active: false },
  { id: "tag", query: "#", active: false },
  { id: "exclude_name", query: "OR @i -@i", active: true },
];

const createQueryTuple = (
  data: QueryData,
): [CommandID, QueryData] => [data.id, data];

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
