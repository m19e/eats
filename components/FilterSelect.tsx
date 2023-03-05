import type { TweetFilter } from "types/builder.ts";

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

const filtersMap = {
  tweet: tweetFilters,
  media: mediaFilters,
} as const;

type Props = {
  type: TweetFilter;
  onChange: (value: string) => void;
};

export const FilterSelect = ({ type, onChange }: Props) => {
  const options = filtersMap[type].map(({ value, label }) => (
    <option key={value} value={value}>{label}</option>
  ));

  return (
    <select
      class="px-1 min-w-[12rem] rounded border-2 focus:border(twitter) outline-none"
      defaultValue={filtersMap[type][0].value}
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {options}
    </select>
  );
};
