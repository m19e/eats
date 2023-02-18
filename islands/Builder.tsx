import type { FunctionComponent } from "preact";
import { computed, signal } from "@preact/signals";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

type QueryData = {
  id: string;
  query: string;
  active: boolean;
};

const queryMap = signal(new Map<string, QueryData>());
const queryString = computed(() => {
  return [...queryMap.value.values()].filter((q) => q.active).map((q) =>
    q.query
  ).join(" ");
});
const updateQuery = (data: QueryData) => {
  queryMap.value = new Map(queryMap.value.set(data.id, data));
};
const toggleQuery = (data: QueryData) => {
  const { id, active } = data;
  const prevQuery = queryMap.value.get(id) ?? data;
  updateQuery({ ...prevQuery, active });
};

const Builder = () => {
  return (
    <div class="space-y-4 px-3 w-full">
      <Category title="Users" />
      <Command
        id="from"
        title="from"
        onToggle={(active) =>
          toggleQuery({ id: "from", query: "from:", active })}
      >
        <TextInput
          placeholder="screen name"
          onInput={(v) =>
            updateQuery({ id: "from", query: `from:${v}`, active: true })}
        />
      </Command>
      <Command
        id="to"
        title="to"
        onToggle={(active) => toggleQuery({ id: "to", query: "to:", active })}
      >
        <TextInput
          placeholder="screen name"
          onInput={(v) =>
            updateQuery({ id: "to", query: `to:${v}`, active: true })}
        />
      </Command>
      <Command
        id="filter:follows"
        title="filter"
        onToggle={(active) =>
          toggleQuery({
            id: "filter:follows",
            query: "filter:follows",
            active,
          })}
      >
        <input
          class="border px-2"
          type="text"
          value="follows"
          disabled
        />
      </Command>
      <Command id="@" title="@">
        <input type="text" placeholder="screen name" class="border px-2" />
      </Command>

      <Category title="Tweet Type" />
      <Command id="filter:media" title="filter" desc="media type">
        <MediaSelect />
      </Command>
      <Command id="filter:tweet" title="filter" desc="tweet type"></Command>

      {
        /* <Category title="Time" />
      <Command id="until" title="until">
      </Command>
      <Command id="since" title="since">
      </Command>
      <Command id="until_time" title="until_time"></Command>
      <Command id="since_time" title="since_time"></Command>
      <Command id="since_id" title="since_id"></Command>
      <Command id="max_id" title="max_id"></Command>
      <Command id="within_time" title="within_time"></Command>
      <Command id="min_retweets" title="min_retweets"></Command>
      <Command id="min_faves" title="min_faves"></Command> */
      }
      <SearchQuery />
    </div>
  );
};

const SearchQuery = () => {
  return (
    <div class="w-full flex items-center gap-2">
      <input
        class="py-1 px-2 flex-1 rounded border border-gray-400"
        value={queryString.value}
        placeholder="Search Query"
        disabled
      />
      <div class="flex justify-center items-center rounded-full border-2 border-gray-400 w-8 h-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

const Category = ({ title }: { title: string }) => {
  return <h2 class="text-xl border-b border-black">{title}</h2>;
};

type TextInputProps = {
  placeholder: string;
  onInput: (value: string) => void;
  disabled?: boolean;
};

const TextInput = ({ placeholder, onInput, disabled }: TextInputProps) => {
  const [text, setText] = useState("");
  const handleInput = (value: string) => {
    onInput(value);
    setText(value);
  };

  return (
    <input
      class="border px-2"
      type="text"
      placeholder={placeholder}
      value={text}
      onInput={(e) => handleInput(e.currentTarget.value)}
      disabled={!IS_BROWSER || disabled}
    />
  );
};

type CommandProps = {
  id: string;
  title: string;
  desc?: string;
  onToggle?: (a: boolean) => void;
};

const Command: FunctionComponent<CommandProps> = (
  { id, title, desc, onToggle, children },
) => {
  return (
    <div class="flex w-full">
      <input
        type="checkbox"
        checked={queryMap.value.get(id)?.active}
        onClick={(e) => onToggle && onToggle(e.currentTarget.checked)}
      />
      <div class="flex flex-1">
        <p class="flex-1 mx-2 border-b border-black border-opacity-50">
          {title}:{desc &&
            (
              <span class="text-black text-opacity-50 px-1 text-sm">
                {desc}
              </span>
            )}
        </p>
        {children}
      </div>
    </div>
  );
};

const mediaFilters: { value: string; label: string }[] = [
  { value: "media", label: "media" },
  { value: "twimg", label: "twimg" },
  { value: "images", label: "images" },
  { value: "videos", label: "videos" },
  { value: "native_video", label: "native_video" },
  { value: "consumer_video", label: "consumer_video" },
  { value: "pro_video", label: "pro_video" },
  { value: "spaces", label: "spaces" },
];

const MediaSelect = () => {
  const options = mediaFilters.map(({ value, label }) => (
    <option key={value} value={value}>{label}</option>
  ));

  return (
    <select class="border px-2">
      {options}
    </select>
  );
};

export default Builder;
