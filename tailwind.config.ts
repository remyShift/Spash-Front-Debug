import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#353540",
        lightBackground: "#444454",
        lighterBackground: "#72728B",
        primary: "#FF5F49",
        tertiary: "#DBDBDB",
      },
      fontFamily: {
        gilroy: ["var(--font-gilroy)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
