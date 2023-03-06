import { useEffect, useState } from "preact/hooks";
import { effect } from "@preact/signals";
import { motion, useAnimationControls } from "framer-motion";
import IconChevronRight from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/chevron-right.tsx";

import type { TweetFilter } from "types/builder.ts";
import {
  queryMap,
  selectedCommand,
  toggleQuery,
  updateQuery,
} from "utils/signals.ts";
import type { CommandID } from "utils/signals.ts";

import { TextInput } from "components/TextInput.tsx";
import { FilterSelect } from "components/FilterSelect.tsx";
import { DateSelect } from "components/DateSelect.tsx";

type GetQueryFn = (value: string) => string;
type CalendarID = "until" | "since";
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
  calendarId: CalendarID;
};
type Content = { type: "group"; title: string } | {
  type: "command";
  id: CommandID;
  title?: string;
  noColon?: boolean;
  desc?: string;
  hint: string;
  defaultQuery: string;
  form: ContentForm;
};

const splitQueryText = (text: string): string[] => {
  return text.trim().split(/\s+/).filter((c) => c);
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
    hint: "キーワードをすべて含む",
    defaultQuery: "",
    form: forms.keywords,
  },
  {
    type: "command",
    id: "exact",
    title: `"exact match"`,
    noColon: true,
    hint: "キーワード全体を含む",
    defaultQuery: `""`,
    form: forms.exact,
  },
  {
    type: "command",
    id: "or",
    title: "yes OR no",
    noColon: true,
    hint: "キーワードのいずれかを含む",
    defaultQuery: "",
    form: forms.or,
  },
  {
    type: "command",
    id: "minus",
    title: "-minus",
    noColon: true,
    hint: "キーワードを含まない",
    defaultQuery: "-",
    form: forms.minus,
  },
  {
    type: "command",
    id: "tag",
    title: "#hashtag",
    noColon: true,
    hint: "ハッシュタグを含む",
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
    hint: "指定アカウントのツイート",
    defaultQuery: "from:",
    form: forms.from,
  },
  {
    type: "command",
    id: "to",
    noColon: false,
    hint: "指定アカウント宛てのツイート",
    defaultQuery: "to:",
    form: forms.to,
  },
  {
    type: "command",
    id: "filter:follows",
    title: "filter",
    hint: "フォローしているアカウントのツイート",
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
    hint: "メディアタイプ(画像,動画...)で絞り込み",
    defaultQuery: "filter:images",
    form: forms["filter:media"],
  },
  {
    type: "command",
    id: "filter:tweet",
    title: "filter",
    desc: "tweet type",
    hint: "ツイートタイプ(RT,返信,引用)で絞り込み",
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
    hint: "指定した日付以前のツイート",
    defaultQuery: "until:2023-1-1",
    form: forms.until,
  },
  {
    type: "command",
    id: "since",
    hint: "指定した日付以降のツイート",
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
    hint: "RTの最小件数",
    defaultQuery: "min_retweets:0",
    form: forms.min_retweets,
  },
  {
    type: "command",
    id: "min_faves",
    hint: "お気に入りの最小件数",
    defaultQuery: "min_faves:0",
    form: forms.min_faves,
  },
  {
    type: "command",
    id: "min_replies",
    hint: "返信の最小件数",
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

      <BuilderBody />
    </>
  );
};

const BuilderBody = () => {
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
  return <h2 class="text-xl text-gray-800 font-semibold">{title}</h2>;
};

type CommandProps = {
  id: CommandID;
  title?: string;
  noColon?: boolean;
  desc?: string;
  hint?: string;
  onToggle: (a: boolean) => void;
  form: ContentForm;
};
const Command = (
  {
    id,
    title,
    noColon = false,
    desc,
    hint,
    onToggle,
    form,
  }: CommandProps,
) => {
  const controls = useAnimationControls();

  effect(() => {
    const isOpen = selectedCommand.value === id;
    controls.start({
      height: isOpen ? "100%" : "0px",
    });
  });

  const handleSelectCommand = () => {
    selectedCommand.value = id;
  };

  return (
    <div class="group" onClick={handleSelectCommand}>
      <div class="flex items-center w-full">
        <Checkbox
          checked={queryMap.value.get(id)?.active}
          onClick={(checked) => onToggle(checked)}
        />
        <div class="flex flex-1">
          <div class="flex-1 flex flex-col px-1">
            <p class="px-1 text-gray-800 group-hover:font-medium group-hover:text(twitter) transition-colors sm:duration-300">
              {title ?? id}
              {!noColon && ":"}
              {desc &&
                (
                  <span class="hidden sm:inline text-gray-800 text-opacity-50 group-hover:text(twitter opacity-50) px-1 text-sm">
                    {desc}
                  </span>
                )}
            </p>
            <span class="bg(twitter) h-[1px] w-0 group-hover:!w-full transition-all sm:duration-300" />
          </div>
          <CommandForm {...form} />
        </div>
      </div>
      {(hint) &&
        (
          <motion.div
            className="overflow-hidden w-full h-[1px] pt-[1px]"
            animate={controls}
            transition={{
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
          >
            <Hint hint={hint} />
          </motion.div>
        )}
    </div>
  );
};

const Hint = ({ hint }: { hint: string }) => {
  return (
    <div class="flex w-full bg-gray-100 text-gray-600 rounded">
      <IconChevronRight size={24} />
      <div class="flex-1">
        <span class="text-sm">{hint}</span>
      </div>
    </div>
  );
};

type CheckBoxProps = {
  checked?: boolean;
  onClick: (checked: boolean) => void;
};
const Checkbox = ({ checked, onClick }: CheckBoxProps) => {
  return (
    <div
      class={`flex items-center justify-center w-5 h-5 rounded-full cursor-pointer ${
        checked ? "bg(twitter)" : "border-2 border-gray-600"
      }`}
      onClick={() => onClick(!checked)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5 text-white"
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
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
        class="px-2 w-[12rem] text-gray-800 border-2 rounded outline-none disabled:(cursor-not-allowed)"
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
const Calendar = ({ id }: { id: CalendarID }) => {
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
    <div class="flex gap-1 w-[12rem]">
      <div class="w-[5rem]">
        <DateSelect
          times={[...range(2006, 2023)].reverse()}
          onChange={(value) => updateCalendar({ y: value })}
        />
      </div>
      <div class="w-[3.5rem]">
        <DateSelect
          times={[...range(1, 12)]}
          onChange={(value) => updateCalendar({ m: value })}
        />
      </div>
      <div class="w-[3.5rem]">
        <DateSelect
          times={[...range(1, 31)]}
          onChange={(value) => updateCalendar({ d: value })}
        />
      </div>
    </div>
  );
};

export default QueryBuilder;
