
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-BlazheRegular)", "serif"],
        paragraph: ["eczar"],
      },
      colors: {
        backgroundColor: "var(--gray2)",
        BackgroundAccentColor: "var(--gray3)",
        textColor: "var(--gray1)",
        primaryColor: "var(--green)",
        accentColor: "var(--yellow)",
        secondaryAccentColor: "var(--darkRed)",
        fontColor: "var(--gray1)",
        fontColorInverted: "var(--gray2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        grain: "url('../../public/grain.svg')",
      },
    },
  },
  plugins: [],
};
