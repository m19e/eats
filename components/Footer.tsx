import IconBrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/brand-github.tsx";

export const Footer = () => {
  return (
    <footer class="flex justify-center bg-gray-100 border-t-2 border-gray-200">
      <div class="w-full flex justify-between items-center p-4 max-w-screen-sm">
        <span class="text-sm">©2023 m19e</span>
        <a
          href="https://github.com/m19e/eats"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandGithub />
        </a>
      </div>
    </footer>
  );
};
