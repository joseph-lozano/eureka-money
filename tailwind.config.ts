import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import { corporate } from "daisyui/src/theming/themes";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "\"Inter\"",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "\"Apple Color Emoji\"",
          "\"Segoe UI Emoji\"",
          "\"Segoe UI Symbol\"",
          "\"Noto Color Emoji\"",
        ],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...corporate,
          "primary": "#059669", // Tailwind's emerald-600
          "primary-content": "#ffffff", // White text for good contrast on emerald-600
          "accent": "#FFD700", // A vibrant gold color
          "accent-content": "#000000", // Black text for good contrast on gold
        },
      },
    ],
  },
} satisfies Config;
