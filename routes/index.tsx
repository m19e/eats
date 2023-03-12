import SearchQuery from "/islands/SearchQuery.tsx";
import QueryBuilder from "/islands/QueryBuilder.tsx";

import { Header } from "/components/Header.tsx";
import { Footer } from "/components/Footer.tsx";

export default function Home() {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="flex-1 flex items-start justify-center">
        {/* TODO: remove needless space-y */}
        <div class="p-2 sm:p-4 space-y-2 sm:space-y-3 w-full max-w-screen-sm">
          <SearchQuery />
          <QueryBuilder />
        </div>
      </main>
      <Footer />
    </div>
  );
}
