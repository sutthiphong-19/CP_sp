import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101a2d",
        accent: "#3268f5"
      }
    }
  },
  plugins: []
};

export default config;
