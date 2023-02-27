import { isExcludeUser, queryString } from "utils/signals.ts";

const SearchQuery = () => {
  const searchURL = `https://twitter.com/search?q=${
    encodeURIComponent(queryString.value)
  }&src=typed_query`;

  return (
    <div class="space-y-2 pb-2 border-b">
      <a
        class="relative flex items-center pl-12 pr-4 py-3 rounded-3xl border border(twitter)"
        href={searchURL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p class="whitespace-pre-wrap">
          {queryString.value || (
            <span class="opacity-50">
              Search Query
            </span>
          )}
        </p>
        <div class="h-full absolute inset-0 flex items-center ml-4">
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
      </a>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isExcludeUser.value}
          onClick={() => isExcludeUser.value = !isExcludeUser.value}
        />
        <p class="text-sm">
          Exclude user name and screen name
        </p>
      </div>
    </div>
  );
};

export default SearchQuery;
