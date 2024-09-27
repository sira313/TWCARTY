/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,njk,md,js}"],
  theme: {
    extend: {
      screens: {
        'tn': '400px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#2472c8",
          "primary-content": "#ffffff",
          "secondary": "#3b8eea",
          "secondary-content": "#ffffff",
          "accent": "#f14c4c",
          "accent-content": "#ffffff",
          "neutral": "#ffffff",
          "neutral-content": "#1e1e1e",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-300": "#bebebe",
          "base-content": "#161516",
          "info": "#4283c3",
          "info-content": "#000416",
          "success": "#0dbc79",
          "success-content": "#00160e",
          "warning": "#f8ae32",
          "warning-content": "#0f0800",
          "error": "#cd3131",
          "error-content": "#ffffff",
        },
      },
      {
        dark: {
          "primary": "#2472c8",
          "primary-content": "#000b14",
          "secondary": "#3b8eea",
          "secondary-content": "#000a16",
          "accent": "#f14c4c",
          "accent-content": "#000000",
          "neutral": "#181818",
          "neutral-content": "#ccccc9",
          "base-100": "#1f1f1f",
          "base-200": "#181818",
          "base-300": "#171717",
          "base-content": "#d0d0d0",
          "info": "#4283c3",
          "info-content": "#ffffff",
          "success": "#0dbc79",
          "success-content": "#010e01",
          "warning": "#f8ae32",
          "warning-content": "#000000",
          "error": "#cd3131",
          "error-content": "#000000",
        },
      },
    ],
  },
}