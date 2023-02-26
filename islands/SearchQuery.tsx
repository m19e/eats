import { isExcludeUser, queryString } from "utils/signals.ts";

const SearchQuery = () => {
  return (
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <p class="py-1 px-2 flex-1 rounded-full border border-gray-400 whitespace-pre-wrap">
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
