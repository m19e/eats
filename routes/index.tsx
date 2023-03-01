import SearchQuery from "islands/SearchQuery.tsx";
import QueryBuilder from "islands/QueryBuilder.tsx";

import { Header } from "components/Header.tsx";
import { Footer } from "components/Footer.tsx";

export default function Home() {
  return (
    <>
      <Header />
      <div class="p-4 mx-auto flex flex-col items-center max-w-screen-sm">
        <div class="space-y-3 w-full">
          <SearchQuery />
          <QueryBuilder />
        </div>
      </div>
      <Footer />
    </>
  );
}
