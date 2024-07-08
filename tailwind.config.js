/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{html,njk,md}"],
  theme: {
    extend: {
      screens: {
        'ssm': '400px',
        'xsm': '0px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}

