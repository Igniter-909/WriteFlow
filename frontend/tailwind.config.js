/** @type {import('tailwindcss').Config} */
import daisyUIThemes from "daisyui/src/theming/themes";
import daisyui from "daisyui";


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyUIThemes["light"],
          primary: "blue",
          secondary: "teal",
        },
        black:{
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
					secondary: "rgb(24, 24, 24)",
        }
      },
    ],
}
}