import { computed, signal } from "@preact/signals";

import type { CommandID } from "types/builder.ts";

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

export const selectedCommand = signal<CommandID | undefined>(undefined);
