import IconBrandTwitter from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/brand-twitter.tsx";

export const Header = () => {
  return (
    <header class="flex justify-center bg(twitter)">
      <div class="w-full max-w-screen-sm">
        <div class="flex items-center gap-1 sm:gap-1.5 p-2 sm:p-4 text-white">
          <IconBrandTwitter color="white" size={36} stroke={1} />
          <a href="/">
            <h1 class="font-extrabold text-3xl">EATS</h1>
          </a>
          <span class="text-sm sm:text-base">
            -Easy Advanced Twitter Search-
          </span>
        </div>
      </div>
    </header>
  );
};
