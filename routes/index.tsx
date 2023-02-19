import { Head } from "$fresh/runtime.ts";
import Counter from "islands/Counter.tsx";
import Builder from "islands/Builder.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>EATS | Easy Advanced Twitter Search</title>
      </Head>
      <div class="p-4 mx-auto flex flex-col items-center max-w-screen-sm">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        {
          /* <p class="my-6">
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p>
        <Counter start={3} /> */
        }
        <Builder />
      </div>
    </>
  );
}
