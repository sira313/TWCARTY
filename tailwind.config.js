/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,njk,md,js}"],
  theme: {
    extend: {
      aspectRatio: {
        '21/9': '21 / 9',
        '21/8': '20 / 7',
        '3/4':  '3 / 4',
      },
      screens: {
        'tn': '400px',
      }
    },
  },
}