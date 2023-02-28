import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    fontFamily: {
      default: ["RoundedMPlus", "sans-serif"],
    },
    extend: {
      colors: {
        twitter: "#1DA1F2",
      },
    },
  },
} as Options;
