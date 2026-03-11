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
        background: "var(--background)",
        foreground: "var(--foreground)",
        apple: {
          blue: "#0A84FF",
          cyan: "#5AC8FA",
        },
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F7",
          200: "#E8E8ED",
          300: "#D2D2D7",
          400: "#AEAEB2",
          500: "#8E8E93",
          600: "#636366",
          700: "#48484A",
          800: "#2C2C2E",
          900: "#1C1C1E",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.1)",
        soft: "0 1px 4px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
export default config;
