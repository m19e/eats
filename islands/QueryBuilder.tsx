import type {
  CategoryData,
  CommandID,
  Content,
  ContentForm,
} from "types/builder.ts";
import { toggleQuery } from "utils/signals.ts";

import { Command } from "components/Command.tsx";

const splitQueryText = (text: string): string[] => {
  return text.trim().split(/\s+/).filter((c) => c);
};
const createQueryFromWords = (
  words: string,
  formatter: ((word: string) => string) | null,
  separater = " ",
) => {
  const splitted = splitQueryText(words);
  if (formatter) {
    return splitted.map(formatter).join(separater);
  }
  return splitted.join(separater);
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
    getQuery: (v) => `(${createQueryFromWords(v, null, " OR ")})`,
  },
  minus: {
    type: "input",
    id: "minus",
    placeholder: "cats dogs",
    getQuery: (v) => createQueryFromWords(v, (c) => `-${c}`),
  },
  tag: {
    type: "input",
    id: "tag",
    placeholder: "ThrowbackThursday",
    getQuery: (v) => createQueryFromWords(v, (c) => `#${c}`),
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
    id: "filter:media",
    getQuery: (v) => `filter:${v.trim()}`,
  },
  "filter:tweet": {
    type: "select",
    id: "filter:tweet",
    getQuery: (v) => `filter:${v.trim()}`,
  },
  lang: {
    type: "select",
    id: "lang",
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
    type: "command",
    id: "lang",
    hint: "指定した言語のツイート",
    defaultQuery: "lang:ja",
    form: forms.lang,
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

const datas: CategoryData[] = [
  {
    title: "Basic",
    commands: [
      {
        id: "keywords",
        noColon: true,
        hint: "キーワードをすべて含む",
        defaultQuery: "",
        form: forms.keywords,
      },
      {
        id: "exact",
        title: `"exact match"`,
        noColon: true,
        hint: "キーワード全体を含む",
        defaultQuery: `""`,
        form: forms.exact,
      },
      {
        id: "or",
        title: "yes OR no",
        noColon: true,
        hint: "キーワードのいずれかを含む",
        defaultQuery: "",
        form: forms.or,
      },
      {
        id: "minus",
        title: "-minus",
        noColon: true,
        hint: "キーワードを含まない",
        defaultQuery: "-",
        form: forms.minus,
      },
      {
        id: "tag",
        title: "#hashtag",
        noColon: true,
        hint: "ハッシュタグを含む",
        defaultQuery: "#",
        form: forms.tag,
      },
    ],
  },
  {
    title: "Users",
    commands: [
      {
        id: "from",
        noColon: false,
        hint: "指定アカウントのツイート",
        defaultQuery: "from:",
        form: forms.from,
      },
      {
        id: "to",
        noColon: false,
        hint: "指定アカウント宛てのツイート",
        defaultQuery: "to:",
        form: forms.to,
      },
      {
        id: "filter:follows",
        title: "filter",
        hint: "フォローしているアカウントのツイート",
        defaultQuery: "filter:follows",
        form: forms["filter:follows"],
      },
    ],
  },
  {
    title: "Tweet Type",
    commands: [
      {
        id: "filter:media",
        title: "filter",
        desc: "media type",
        hint: "メディアタイプ(画像,動画...)で絞り込み",
        defaultQuery: "filter:images",
        form: forms["filter:media"],
      },
      {
        id: "filter:tweet",
        title: "filter",
        desc: "tweet type",
        hint: "ツイートタイプ(RT,返信,引用)で絞り込み",
        defaultQuery: "filter:nativeretweets",
        form: forms["filter:tweet"],
      },
      {
        id: "lang",
        hint: "指定した言語のツイート",
        defaultQuery: "lang:ja",
        form: forms.lang,
      },
    ],
  },
  {
    title: "Time",
    commands: [
      {
        id: "until",
        hint: "指定した日付以前のツイート",
        defaultQuery: "until:2023-1-1",
        form: forms.until,
      },
      {
        id: "since",
        hint: "指定した日付以降のツイート",
        defaultQuery: "since:2023-1-1",
        form: forms.since,
      },
    ],
  },
  {
    title: "Engagement",
    commands: [
      {
        id: "min_retweets",
        hint: "RTの最小件数",
        defaultQuery: "min_retweets:0",
        form: forms.min_retweets,
      },
      {
        id: "min_faves",
        hint: "お気に入りの最小件数",
        defaultQuery: "min_faves:0",
        form: forms.min_faves,
      },
      {
        id: "min_replies",
        hint: "返信の最小件数",
        defaultQuery: "min_replies:0",
        form: forms.min_replies,
      },
    ],
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

      <Categories />
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

const Categories = () => {
  const categories = datas.map((category) => {
    const { title, commands } = category;

    return (
      <div key={title} class="space-y-2 sm:space-y-3">
        <Category title={title} />
        <Commands commands={commands} />
      </div>
    );
  });

  return <>{categories}</>;
};

const Commands = (props: { commands: CategoryData["commands"] }) => {
  const commands = props.commands.map((c) => {
    const { defaultQuery, ...props } = c;
    const { id } = props;

    return (
      <Command
        key={id}
        onToggle={(active) => toggleQuery({ id, active, query: defaultQuery })}
        {...props}
      />
    );
  });

  return <>{commands}</>;
};

export default QueryBuilder;
