import type { SelectID } from "types/builder.ts";

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

const optionsMap = {
  "filter:media": mediaFilters,
  "filter:tweet": tweetFilters,
  lang: langs,
} as const;

type Props = {
  id: SelectID;
  onChange: (value: string) => void;
};

export const Select = ({ id, onChange }: Props) => {
  const options = optionsMap[id].map(({ value, label }) => (
    <option key={value} value={value}>{label}</option>
  ));

  return (
    <select
      class="px-1 min-w-[12rem] rounded border-2 focus:border(twitter) outline-none"
      defaultValue={optionsMap[id][0].value}
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {options}
    </select>
  );
};
