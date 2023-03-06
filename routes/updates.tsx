import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { gfm } from "utils/markdown.ts";

import { Header } from "components/Header.tsx";
import { Footer } from "components/Footer.tsx";

interface Data {
  markdown: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const url = new URL(`../static/updates.md`, import.meta.url);
    const fileContent = await Deno.readTextFile(url);
    return ctx.render({ markdown: fileContent });
  },
};

const Updates = ({ data: { markdown } }: PageProps<Data>) => {
  return (
    <>
      <Head>
        <style>
          {gfm.CSS}
        </style>
      </Head>

      <div class="flex flex-col min-h-screen">
        <Header />
        <main class="flex items-start justify-center flex-1 bg-gray-100">
          <div class="m-2 sm:m-4 p-4 w-full max-w-screen-sm rounded-lg bg-white">
            <Body markdown={markdown} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

const Body = ({ markdown }: { markdown: string }) => {
  const body = gfm.render(markdown);
  const html =
    `<div data-color-mode="light" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
  ${body}
</div>`;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Updates;