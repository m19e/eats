import { useState } from "preact/hooks";
import copy from "copy";
import { IconCheck, IconCopy, IconSearch, IconShare } from "utils/icons.ts";

import { isExcludeUser, queryString } from "utils/signals.ts";

const SearchQuery = () => {
  // TODO: remove needless space-y
  return (
    <div class="space-y-2 pb-2 border-b">
      <SearchBox />
      <div className="flex justify-start">
        <div
          class="flex items-center gap-2 cursor-pointer"
          onClick={() => isExcludeUser.value = !isExcludeUser.value}
        >
          <div
            class={`flex items-center justify-center w-5 h-5 rounded-full ${
              isExcludeUser.value ? "bg(twitter)" : "border-2 border-gray-600"
            }`}
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

          <p class="text-sm select-none">
            Exclude user name and screen name
          </p>
        </div>
      </div>
    </div>
  );
};

const createSearchURL = (query: string) =>
  `https://twitter.com/search?q=${encodeURIComponent(query)}&src=typed_query`;
const createShareURL = (query: string) =>
  `https://twitter.com/intent/tweet?text=${
    encodeURIComponent(`EATSで検索URLを作成しました！

${createSearchURL(query)} #EATS_share`)
  }`;

const SearchBox = () => {
  const [active, setActive] = useState(false);
  const searchURL = createSearchURL(queryString.value);
  const shareURL = createShareURL(queryString.value);

  const underClass = active ? "opacity-20" : "";

  return (
    <div
      class="relative group flex items-center pl-12 pr-4 py-3 rounded-3xl border border(twitter) overflow-hidden"
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <p class={`whitespace-pre-wrap transition-opacity ${underClass}`}>
        {queryString.value || (
          <span class="opacity-50">
            Search Query
          </span>
        )}
      </p>
      <div
        class={`h-full absolute inset-0 flex items-center ml-4 transition-opacity ${underClass}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 text(twitter)"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {active &&
        (
          <div class="absolute inset-0 bg-transparent px-4 flex items-center justify-center gap-1 sm:gap-2">
            <CopyButton text={queryString.value} />
            <a
              class="p-1.5 sm:p-2 flex items-center gap-1 sm:gap-1.5 text(twitter) bg-white border rounded shadow"
              href={shareURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconShare size={16} />
              <span class="text-sm font-semibold">
                Share URL
              </span>
            </a>
            <a
              class="p-1.5 sm:p-2 flex items-center gap-1 sm:gap-1.5 text-white bg(twitter) rounded shadow"
              href={searchURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconSearch size={16} />
              <span class="text-sm font-medium">
                Search
              </span>
            </a>
          </div>
        )}
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) return;
    copy(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      class="p-1.5 sm:p-2 flex items-center gap-1 sm:gap-1.5 text-white bg(twitter) border rounded shadow focus:outline-none"
      onClick={handleCopy}
    >
      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
      <span class="text-sm font-semibold">
        Copy Query
      </span>
    </button>
  );
};

export default SearchQuery;
