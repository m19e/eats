import { useEffect, useState } from "preact/hooks";

import type { TweetFilter } from "types/builder.ts";
import { queryMap, toggleQuery, updateQuery } from "utils/signals.ts";
import type { CommandID } from "utils/signals.ts";

import { TextInput } from "components/TextInput.tsx";
import { FilterSelect } from "components/FilterSelect.tsx";
import { DateSelect } from "components/DateSelect.tsx";

type GetQueryFn = (value: string) => string;
type ContentForm = {
  type: "input";
  id: CommandID;
  placeholder: string;
  getQuery?: GetQueryFn;
} | {
  type: "input:disabled";
  value: string;
} | {
  type: "select";
  filterType: TweetFilter;
} | {
  type: "calendar";
  calendarId: "until" | "since";
};
type Content = { type: "group"; title: string } | {
  type: "command";
  id: CommandID;
  title?: string;
  noColon?: boolean;
  desc?: string;
  defaultQuery: string;
  form: ContentForm;
};

const splitQueryText = (text: string): string[] => {
  return text.trim().split(" ").filter((c) => c);
};
const forms: {
  [key in CommandID]: ContentForm;
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
  from: {
    type: "input",
    id: "from",
    placeholder: "@discord_jp",
  },
  to: {
    type: "input",
    id: "to",
    placeholder: "@discord_jp",
  },
  until: {
    type: "calendar",
    calendarId: "until",
  },
  since: {
    type: "calendar",
    calendarId: "since",
  },
  min_retweets: {
    type: "input",
    id: "min_retweets",
    placeholder: "280",
  },
  min_faves: {
    type: "input",
    id: "min_faves",
    placeholder: "280",
  },
  min_replies: {
    type: "input",
    id: "min_replies",
    placeholder: "280",
  },
  "filter:follows": {
    type: "input:disabled",
    value: "follows",
  },
  "filter:media": {
    type: "select",
    filterType: "media",
  },
  "filter:tweet": {
    type: "select",
    filterType: "tweet",
  },
};
const contents: Content[] = [
  { type: "group", title: "Basic" },
  {
    type: "command",
    id: "keywords",
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
  {
    type: "group",
    title: "Users",
  },
  {
    type: "command",
    id: "from",
    noColon: false,
    defaultQuery: "from:",
    form: forms.from,
  },
  {
    type: "command",
    id: "to",
    noColon: false,
    defaultQuery: "to:",
    form: forms.to,
  },
  {
    type: "command",
    id: "filter:follows",
    title: "filter",
    defaultQuery: "filter:follows",
    form: forms["filter:follows"],
  },
  {
    type: "group",
    title: "Tweet Type",
  },
  {
    type: "command",
    id: "filter:media",
    title: "filter",
    desc: "media type",
    defaultQuery: "filter:images",
    form: forms["filter:media"],
  },
  {
    type: "command",
    id: "filter:tweet",
    title: "filter",
    desc: "tweet type",
    defaultQuery: "filter:nativeretweets",
    form: forms["filter:tweet"],
  },
  {
    type: "group",
    title: "Time",
  },
  {
    type: "command",
    id: "until",
    defaultQuery: "until:2023-1-1",
    form: forms.until,
  },
  {
    type: "command",
    id: "since",
    defaultQuery: "since:2023-1-1",
    form: forms.since,
  },
  {
    type: "group",
    title: "Engagement",
  },
  {
    type: "command",
    id: "min_retweets",
    defaultQuery: "min_retweets:0",
    form: forms.min_retweets,
  },
  {
    type: "command",
    id: "min_faves",
    defaultQuery: "min_faves:0",
    form: forms.min_faves,
  },
  {
    type: "command",
    id: "min_replies",
    defaultQuery: "min_replies:0",
    form: forms.min_replies,
  },
];

const QueryBuilder = () => {
  return (
    <>
      {
        // <Command id="@" title="@" noColon>
        //   <input type="text" placeholder="screen name" class="border px-2" />
        // </Command>
      }

      {/* <Command id="until_time" title="until_time"></Command> */}
      {/* <Command id="since_time" title="since_time"></Command> */}
      {/* <Command id="since_id" title="since_id"></Command> */}
      {/* <Command id="max_id" title="max_id"></Command> */}
      {/* <Command id="within_time" title="within_time"></Command> */}

      <AppContents />
    </>
  );
};

const AppContents = () => {
  const body = contents.map((content) => {
    if (content.type === "group") {
      const { title } = content;
      return (
        <Category
          key={title}
          title={title}
        />
      );
    }
    const { type, defaultQuery, ...props } = content;
    const { id } = props;
    return (
      <Command
        key={id}
        onToggle={(active) => toggleQuery({ id, active, query: defaultQuery })}
        {...props}
      />
    );
  });

  return <>{body}</>;
};

const Category = ({ title }: { title: string }) => {
  return <h2 class="text-xl font-semibold">{title}</h2>;
};

type CommandProps = {
  id: CommandID;
  title?: string;
  desc?: string;
  noColon?: boolean;
  onToggle: (a: boolean) => void;
  form: ContentForm;
};
const Command = (
  { id, title, desc, noColon = false, onToggle, form }: CommandProps,
) => {
  return (
    <div class="flex w-full group">
      <input
        type="checkbox"
        checked={queryMap.value.get(id)?.active}
        onClick={(e) => onToggle(e.currentTarget.checked)}
      />
      <div class="flex flex-1">
        <div class="flex-1 flex flex-col px-1">
          <p class="px-1">
            {title ?? id}
            {!noColon && ":"}
            {desc &&
              (
                <span class="text-black text-opacity-50 px-1 text-sm">
                  {desc}
                </span>
              )}
          </p>
          <span class="bg(twitter) h-[1px] w-0 group-hover:!w-full transition-all sm:duration-300" />
        </div>
        <CommandForm {...form} />
      </div>
    </div>
  );
};

const CommandForm = (props: ContentForm) => {
  if (props.type === "input") {
    const { placeholder, id } = props;
    const getQuery: GetQueryFn = props.getQuery ?? ((v) => `${id}:${v.trim()}`);
    return (
      <TextInput
        placeholder={placeholder}
        onInput={(v) => updateQuery({ id, query: getQuery(v) })}
      />
    );
  }
  if (props.type === "input:disabled") {
    return (
      <input
        class="border px-2 min-w-[12rem]"
        type="text"
        value={props.value}
        disabled
      />
    );
  }
  if (props.type === "select") {
    const { filterType } = props;
    return (
      <FilterSelect
        type={filterType}
        onChange={(value) => {
          updateQuery({
            id: `filter:${filterType}`,
            query: `filter:${value}`,
          });
        }}
      />
    );
  }
  if (props.type === "calendar") {
    return <Calendar id={props.calendarId} />;
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

export default QueryBuilder;
