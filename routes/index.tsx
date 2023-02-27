import { Head } from "$fresh/runtime.ts";
import SearchQuery from "islands/SearchQuery.tsx";
import QueryBuilder from "islands/QueryBuilder.tsx";

export default function Home() {
  return (
    <div class="p-4 mx-auto flex flex-col items-center max-w-screen-sm">
      {
        /* <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        /> */
      }
      <div class="space-y-3 w-full">
        <SearchQuery />
        <QueryBuilder />
      </div>
    </div>
  );
}
