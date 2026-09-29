import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF7F2",
          100: "#F4EFE6", // Warm oatmeal parchment background
          200: "#EAE1D2",
          300: "#DDD0BD",
          400: "#CBBBA5",
        },
        darkbrown: {
          DEFAULT: "#2C1A14", // Rich deep roasted espresso
          hover: "#1F120D",
          dark: "#140A07",
        },
        brown: {
          DEFAULT: "#5E4337", // Warm roasted coffee brown
          light: "#826354",
          hover: "#493228",
          muted: "#9C8275",
        },
        brandgreen: {
          DEFAULT: "#336B3B", // Organic forest & matcha green
          hover: "#25522C",
          light: "#4E8D58",
          soft: "#EAF3EB",
          surface: "#F2F7F2",
        },
        brandorange: {
          DEFAULT: "#C85A17", // Warm appetizing terracotta
          hover: "#AE4D11",
          light: "#E0732E",
          soft: "#FDF3ED",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(44, 26, 20, 0.04)",
        card: "0 4px 16px -2px rgba(44, 26, 20, 0.06)",
        warm: "0 10px 28px -4px rgba(44, 26, 20, 0.08)",
        dropdown: "0 14px 36px -4px rgba(44, 26, 20, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

