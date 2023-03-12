import type { CategoryData, CommandForm, CommandID } from "/types/builder.ts";

export const COMMAND_IDS = {
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
  exclude_name: "EXCLUDE_NAME",
} as const;

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

const FORMS: {
  [key in Exclude<CommandID, "exclude_name">]: CommandForm;
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
    placeholder: "bigdog",
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
    id: "until",
  },
  since: {
    type: "calendar",
    id: "since",
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

export const DATAS: CategoryData[] = [
  {
    title: "Basic",
    commands: [
      {
        id: "keywords",
        noColon: true,
        hint: "キーワードをすべて含む",
        defaultQuery: "",
        form: FORMS.keywords,
      },
      {
        id: "exact",
        title: `"exact match"`,
        noColon: true,
        hint: "キーワード全体を含む",
        defaultQuery: `""`,
        form: FORMS.exact,
      },
      {
        id: "or",
        title: "yes OR no",
        noColon: true,
        hint: "キーワードのいずれかを含む",
        defaultQuery: "",
        form: FORMS.or,
      },
      {
        id: "minus",
        title: "-minus",
        noColon: true,
        hint: "キーワードを含まない",
        defaultQuery: "-",
        form: FORMS.minus,
      },
      {
        id: "tag",
        title: "#hashtag",
        noColon: true,
        hint: "ハッシュタグを含む",
        defaultQuery: "#",
        form: FORMS.tag,
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
        form: FORMS.from,
      },
      {
        id: "to",
        noColon: false,
        hint: "指定アカウント宛てのツイート",
        defaultQuery: "to:",
        form: FORMS.to,
      },
      {
        id: "filter:follows",
        title: "filter",
        hint: "フォローしているアカウントのツイート",
        defaultQuery: "filter:follows",
        form: FORMS["filter:follows"],
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
        form: FORMS["filter:media"],
      },
      {
        id: "filter:tweet",
        title: "filter",
        desc: "tweet type",
        hint: "ツイートタイプ(RT,返信,引用)で絞り込み",
        defaultQuery: "filter:nativeretweets",
        form: FORMS["filter:tweet"],
      },
      {
        id: "lang",
        hint: "指定した言語のツイート",
        defaultQuery: "lang:ja",
        form: FORMS.lang,
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
        form: FORMS.until,
      },
      {
        id: "since",
        hint: "指定した日付以降のツイート",
        defaultQuery: "since:2023-1-1",
        form: FORMS.since,
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
        form: FORMS.min_retweets,
      },
      {
        id: "min_faves",
        hint: "お気に入りの最小件数",
        defaultQuery: "min_faves:0",
        form: FORMS.min_faves,
      },
      {
        id: "min_replies",
        hint: "返信の最小件数",
        defaultQuery: "min_replies:0",
        form: FORMS.min_replies,
      },
    ],
  },
];

const langs = [
  { value: "ja", label: "ja" },
  { value: "en", label: "en" },
] as const;

const tweetFilters = [
  { value: "nativeretweets", label: "nativeretweets" },
  { value: "replies", label: "replies" },
  { value: "quote", label: "quote" },
  // { value: "retweets", label: "retweets" },
] as const;

const mediaFilters = [
  { value: "images", label: "images" },
  { value: "videos", label: "videos" },
  { value: "twimg", label: "twimg" },
  { value: "consumer_video", label: "consumer_video" },
  { value: "media", label: "media" },
  { value: "spaces", label: "spaces" },
  { value: "native_video", label: "native_video" },
  { value: "pro_video", label: "pro_video" },
] as const;

export const OPTIONS_MAP = {
  "filter:media": mediaFilters,
  "filter:tweet": tweetFilters,
  lang: langs,
} as const;
