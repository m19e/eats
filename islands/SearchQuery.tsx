import IconBrandTwitter from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/brand-twitter.tsx";
import { isExcludeUser, queryString } from "utils/signals.ts";

const SearchQuery = () => {
  const searchURL = `https://twitter.com/search?q=${
    encodeURIComponent(queryString.value)
  }&src=typed_query`;

  return (
    <div class="space-y-2 pb-2 border-b">
      <div class="flex items-center gap-2 text-gray-600">
        <IconBrandTwitter color="#1DA1F2" size={36} />
        <h1 class="font-black text-3xl">EATS</h1>
        <span class="font-medium text-sm sm:text-base">
          -Easy Advanced Twitter Search-
        </span>
      </div>
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
  );
};

export default SearchQuery;
