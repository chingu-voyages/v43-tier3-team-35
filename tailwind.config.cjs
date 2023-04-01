/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-quicksand)", "sans-serif"],
    },
    extend: {
      fontSize: {
        hl: [
          "2rem",
          { fontWeight: 400, lineHeight: "2.5rem", letterSpacing: "-0.5px" },
        ],
        hm: ["1.5rem", { fontWeight: 400, lineHeight: "1.5rem" }],
        hs: [
          "1.375rem",
          {
            fontWeight: 500,
            lineHeight: "1.71875rem",
            letterSpacing: "-0.25px",
          },
        ],
        hxs: ["1.125rem", { fontWeight: 500, lineHeight: "1.40625rem" }],
        bodym: ["0.9375rem", { fontWeight: 400, lineHeight: "1.171875rem" }],
        bodys: ["0.94rem", { fontWeight: 300, lineHeight: "1.015625rem" }],
      },
      colors: {
        "sidebar-border": "rgba(246, 240, 240, 0.16)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

module.exports = config;
