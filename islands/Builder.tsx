import type { FunctionComponent } from "preact";
import { computed, signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

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
type CommandID = keyof typeof COMMAND_IDS;
type QueryData = {
  id: CommandID;
  query: string;
  active: boolean;
};
type UpdateQueryData = Omit<QueryData, "active"> & Partial<QueryData>;

const queryMap = signal(new Map<CommandID, QueryData>());
const isExcludeUser = signal(true);
const queryString = computed(() => {
  return [...queryMap.value.values()].filter((q) => q.active).map((q) =>
    q.query
  ).join(" ") + (isExcludeUser.value ? " OR @i -@i" : "");
});
const updateQuery = (
  { id, query, active = true }: UpdateQueryData,
) => {
  queryMap.value = new Map(queryMap.value.set(id, { id, query, active }));
};
const toggleQuery = (data: QueryData) => {
  const { id, active } = data;
  const prevQuery = queryMap.value.get(id) ?? data;
  updateQuery({ ...prevQuery, active });
};

type GetQueryFn = (value: string) => string;
type ContentForm = {
  type: "input";
  id: CommandID;
  placeholder: string;
  getQuery?: GetQueryFn;
} | {
  type: "input:disabled";
  id: CommandID;
  value: string;
} | {
  type: "select";
  filterType: "media" | "tweet";
} | {
  type: "calendar";
  calendarType: "until" | "since";
};
type Content = { type: "group"; title: string } | {
  type: "command";
  id: CommandID;
  title: string;
  noColon: boolean;
  defaultQuery: string;
  form: ContentForm;
};

const splitQueryText = (text: string): string[] => {
  return text.trim().split(" ").filter((c) => c);
};
const forms: {
  [key in Extract<CommandID, "keywords" | "exact" | "or" | "minus" | "tag">]:
    ContentForm;
} = {
  keywords: {
    type: "input",
    id: "keywords",
    placeholder: "what’s happening",
    getQuery: (v) => v.trim(),
  },
  exact: {
    type: "input",
    id: "exact",
    placeholder: "happy hour",
    getQuery: (v) => `"${v.trim()}"`,
  },
  or: {
    type: "input",
    id: "or",
    placeholder: "cats dogs",
    getQuery: (v) => `(${splitQueryText(v).join(" OR ")})`,
  },
  minus: {
    type: "input",
    id: "minus",
    placeholder: "cats dogs",
    getQuery: (v) => splitQueryText(v).map((c) => `-${c}`).join(" "),
  },
  tag: {
    type: "input",
    id: "tag",
    placeholder: "ThrowbackThursday",
    getQuery: (v) => splitQueryText(v).map((c) => `#${c}`).join(" "),
  },
};

const contents: Content[] = [
  { type: "group", title: "Basic" },
  {
    type: "command",
    id: "keywords",
    title: "keywords",
    noColon: true,
    defaultQuery: "",
    form: forms.keywords,
  },
  {
    type: "command",
    id: "exact",
    title: `"exact match"`,
    noColon: true,
    defaultQuery: `""`,
    form: forms.exact,
  },
  {
    type: "command",
    id: "or",
    title: "yes OR no",
    noColon: true,
    defaultQuery: "",
    form: forms.or,
  },
  {
    type: "command",
    id: "minus",
    title: "-minus",
    noColon: true,
    defaultQuery: "-",
    form: forms.minus,
  },
  {
    type: "command",
    id: "tag",
    title: "#hashtag",
    noColon: true,
    defaultQuery: "#",
    form: forms.tag,
  },
];

const Builder = () => {
  return (
    <div class="space-y-4 px-3 w-full">
      <SearchQuery />

      <Category title="Basic" />
      <Command
        id="keywords"
        title="keywords"
        noColon
        onToggle={(active) =>
          toggleQuery({ id: "keywords", query: "", active })}
      >
        <TextInput
          placeholder="what’s happening"
          onInput={(v) => updateQuery({ id: "keywords", query: v.trim() })}
        />
      </Command>
      <Command
        id="exact"
        title={`"exact match"`}
        noColon
        onToggle={(active) => toggleQuery({ id: "exact", query: `""`, active })}
      >
        <TextInput
          placeholder="happy hour"
          onInput={(v) => updateQuery({ id: "exact", query: `"${v.trim()}"` })}
        />
      </Command>
      <Command
        id="or"
        title="yes OR no"
        noColon
        onToggle={(active) => toggleQuery({ id: "or", query: "", active })}
      >
        <TextInput
          placeholder="cats dogs"
          onInput={(v) =>
            updateQuery({
              id: "or",
              query: `(${v.trim().split(" ").filter((c) => c).join(" OR ")})`,
            })}
        />
      </Command>
      <Command
        id="minus"
        title="-minus"
        noColon
        onToggle={(active) => toggleQuery({ id: "minus", query: "-", active })}
      >
        <TextInput
          placeholder="cats dogs"
          onInput={(v) =>
            updateQuery({
              id: "minus",
              query: v.trim().split(" ").filter((c) => c).map((c) => `-${c}`)
                .join(
                  " ",
                ),
            })}
        />
      </Command>
      <Command
        id="tag"
        title="#hashtag"
        noColon
        onToggle={(active) => toggleQuery({ id: "tag", query: "#", active })}
      >
        <TextInput
          placeholder="ThrowbackThursday"
          onInput={(v) =>
            updateQuery({
              id: "tag",
              query: v.trim().split(" ").filter((c) => c).map((c) => `#${c}`)
                .join(
                  " ",
                ),
            })}
        />
      </Command>

      <Category title="Users" />
      <Command
        id="from"
        title="from"
        onToggle={(active) =>
          toggleQuery({ id: "from", query: "from:", active })}
      >
        <TextInput
          placeholder="@discord_jp"
          onInput={(v) => updateQuery({ id: "from", query: `from:${v}` })}
        />
      </Command>
      <Command
        id="to"
        title="to"
        onToggle={(active) => toggleQuery({ id: "to", query: "to:", active })}
      >
        <TextInput
          placeholder="@discord_jp"
          onInput={(v) => updateQuery({ id: "to", query: `to:${v}` })}
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
          class="border px-2 min-w-[12rem]"
          type="text"
          value="follows"
          disabled
        />
      </Command>
      {
        // <Command id="@" title="@" noColon>
        //   <input type="text" placeholder="screen name" class="border px-2" />
        // </Command>
      }

      <Category title="Tweet Type" />
      <Command
        id="filter:media"
        title="filter"
        desc="media type"
        onToggle={(active) =>
          toggleQuery({ id: "filter:media", query: "filter:images", active })}
      >
        <FilterSelect type="media" />
      </Command>
      <Command
        id="filter:tweet"
        title="filter"
        desc="tweet type"
        onToggle={(active) =>
          toggleQuery({
            id: "filter:tweet",
            query: "filter:nativeretweets",
            active,
          })}
      >
        <FilterSelect type="tweet" />
      </Command>

      <Category title="Time" />
      <Command
        id="until"
        title="until"
        onToggle={(active) =>
          toggleQuery({ id: "until", query: "until:2023-1-1", active })}
      >
        <Calendar id="until" />
      </Command>
      <Command
        id="since"
        title="since"
        onToggle={(active) =>
          toggleQuery({ id: "since", query: "since:2023-1-1", active })}
      >
        <Calendar id="since" />
      </Command>

      <Category title="Engagement" />
      <Command
        id="min_retweets"
        title="min_retweets"
        onToggle={(active) =>
          toggleQuery({
            id: "min_retweets",
            query: "min_retweets:0",
            active,
          })}
      >
        <TextInput
          placeholder="280"
          onInput={(v) =>
            updateQuery({
              id: "min_retweets",
              query: `min_retweets:${v.trim()}`,
            })}
        />
      </Command>
      <Command
        id="min_faves"
        title="min_faves"
        onToggle={(active) =>
          toggleQuery({ id: "min_faves", query: "min_faves:0", active })}
      >
        <TextInput
          placeholder="280"
          onInput={(v) =>
            updateQuery({ id: "min_faves", query: `min_faves:${v.trim()}` })}
        />
      </Command>
      <Command
        id="min_replies"
        title="min_replies"
        onToggle={(active) =>
          toggleQuery({ id: "min_replies", query: "min_replies:0", active })}
      >
        <TextInput
          placeholder="280"
          onInput={(v) =>
            updateQuery({
              id: "min_replies",
              query: `min_replies:${v.trim()}`,
            })}
        />
      </Command>

      {/* <Command id="until_time" title="until_time"></Command> */}
      {/* <Command id="since_time" title="since_time"></Command> */}
      {/* <Command id="since_id" title="since_id"></Command> */}
      {/* <Command id="max_id" title="max_id"></Command> */}
      {/* <Command id="within_time" title="within_time"></Command> */}

      <AppContents />
    </div>
  );
};

const AppContents = () => {
  const body = contents.map((content) => {
    if (content.type === "group") {
      return <Category title={content.title} />;
    }
    const { id, title, defaultQuery, form, noColon } = content;
    return (
      <Command
        id={id}
        title={title}
        noColon={noColon}
        onToggle={(active) => toggleQuery({ id, active, query: defaultQuery })}
      >
        <CommandForm {...form} />
      </Command>
    );
  });

  return <>{body}</>;
};
const CommandForm = (props: ContentForm) => {
  if (props.type === "input") {
    const { placeholder, id } = props;
    const getQuery: GetQueryFn = props.getQuery ?? ((v) => `${id}:${v}`);
    return (
      <TextInput
        placeholder={placeholder}
        onInput={(v) => updateQuery({ id, query: getQuery(v) })}
      />
    );
  }
  return null;
};

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}
type CalendarData = {
  y: string;
  m: string;
  d: string;
  skip: boolean;
};
const Calendar = ({ id }: { id: "until" | "since" }) => {
  const [calendar, setCalendar] = useState({
    y: "2023",
    m: "1",
    d: "1",
    skip: true,
  });

  useEffect(() => {
    const { y, m, d, skip } = calendar;
    if (skip) return;
    const ymd = `${y}-${m}-${d}`;
    const query = `${id}:${ymd}`;
    updateQuery({ id, query });
  }, [calendar]);

  const updateCalendar = (data: Partial<CalendarData>) => {
    setCalendar((prev) => ({ ...prev, ...data, skip: false }));
  };

  return (
    <div class="flex gap-1 min-w-[12rem]">
      <DateSelect
        times={[...range(2006, 2023)].reverse()}
        onChange={(value) => updateCalendar({ y: value })}
      />
      <span>-</span>
      <DateSelect
        times={[...range(1, 12)]}
        onChange={(value) => updateCalendar({ m: value })}
      />
      <span>-</span>
      <DateSelect
        times={[...range(1, 31)]}
        onChange={(value) => updateCalendar({ d: value })}
      />
    </div>
  );
};
const DateSelect = (
  { times, onChange }: {
    times: number[];
    onChange: (value: string) => void;
  },
) => {
  const options = times
    .map(
      (time) => <option key={time} value={time}>{time}</option>,
    );

  return (
    <select
      class="border px-0.5"
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {options}
    </select>
  );
};

const SearchQuery = () => {
  return (
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <p class="py-1 px-2 flex-1 rounded border border-gray-400 whitespace-pre-wrap">
          {queryString.value || (
            <span class="opacity-50">
              Search Query
            </span>
          )}
        </p>
        <a
          class="flex justify-center items-center rounded-full border-2 border-gray-400 w-8 h-8"
          href={`https://twitter.com/search?q=${
            encodeURIComponent(queryString.value)
          }&src=typed_query`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
        </a>
      </div>
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isExcludeUser.value}
          onClick={(e) => isExcludeUser.value = !isExcludeUser.value}
        />
        <p class="text-sm">
          Exclude user name and screen name
        </p>
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
      class="border px-2 min-w-[12rem]"
      type="text"
      placeholder={placeholder}
      value={text}
      onInput={(e) => handleInput(e.currentTarget.value)}
      disabled={!IS_BROWSER || disabled}
    />
  );
};

type CommandProps = {
  id: CommandID;
  title: string;
  desc?: string;
  noColon?: boolean;
  onToggle?: (a: boolean) => void;
};

const Command: FunctionComponent<CommandProps> = (
  { id, title, desc, noColon = false, onToggle, children },
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
          {title}
          {!noColon && ":"}
          {desc &&
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

const tweetFilters: { value: string; label: string }[] = [
  { value: "nativeretweets", label: "nativeretweets" },
  { value: "retweets", label: "retweets" },
  { value: "replies", label: "replies" },
  { value: "quote", label: "quote" },
];
const mediaFilters: { value: string; label: string }[] = [
  { value: "images", label: "images" },
  { value: "videos", label: "videos" },
  { value: "twimg", label: "twimg" },
  { value: "native_video", label: "native_video" },
  { value: "media", label: "media" },
  { value: "consumer_video", label: "consumer_video" },
  { value: "pro_video", label: "pro_video" },
  { value: "spaces", label: "spaces" },
];
const filtersMap = {
  tweet: tweetFilters,
  media: mediaFilters,
} as const;

const FilterSelect = ({ type }: { type: "tweet" | "media" }) => {
  const options = filtersMap[type].map(({ value, label }) => (
    <option key={value} value={value}>{label}</option>
  ));
  const handleChange = (value: string) => {
    updateQuery({
      id: `filter:${type}`,
      query: `filter:${value}`,
    });
  };

  return (
    <select
      class="border px-2 min-w-[12rem]"
      defaultValue={filtersMap[type][0].value}
      onChange={(e) => handleChange(e.currentTarget.value)}
    >
      {options}
    </select>
  );
};

export default Builder;
