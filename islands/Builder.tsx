const Builder = () => {
  return (
    <div class="space-y-4 px-3 w-1/2">
      <div class="flex border-b border-gray-400">
        <input type="checkbox" />
        <p class="flex-1">
          from:
        </p>
        <input type="text" placeholder="screen name" class="border px-2" />
      </div>
      <div class="flex border-b border-gray-400">
        <input type="checkbox" />
        <p class="flex-1 px-2">
          to:
        </p>
        <input type="text" placeholder="screen name" class="border px-2" />
      </div>
      <div class="flex border-b border-gray-400">
        <input type="checkbox" />
        <p class="flex-1 px-2">
          filter:
        </p>
        <MediaSelect />
      </div>
      <p>filter:</p>
      <p>min_faves</p>
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
    <select>
      {options}
    </select>
  );
};

export default Builder;
