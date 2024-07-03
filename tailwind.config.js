/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{html,njk,md}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

