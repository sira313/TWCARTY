---
layout: post-blog.html
title: Modify Theme
description: TODO
keyword: TODO
date: 2024-08-04
tags:
 - TODO
permalink: /blog/modify-theme.html
---

To change the default colors on this site, you can use the [DaisyUI Theme Generator](https://daisyui.com/theme-generator/) or manually customize them to suit your preferences.

Here's the sample of `tailwind.config.js` that i used for my website [apoxi.cam](https://apoxi.cam).
```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,njk,md}"],
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
          "primary": "#2481bd",
          "primary-content": "#cfdaff",
          "secondary": "#3598d4",
          "secondary-content": "#ebdacf",
          "accent": "#d35728",
          "accent-content": "#cee1ff",
          "neutral": "#dedede",
          "neutral-content": "#454245",
          "base-100": "#ffffff",
          "base-200": "#dedede",
          "base-300": "#bebebe",
          "base-content": "#161516",
          "info": "#4283c3",
          "info-content": "#000416",
          "success": "#25af5e",
          "success-content": "#00160e",
          "warning": "#efc514",
          "warning-content": "#0f0800",
          "error": "#e94c3d",
          "error-content": "#ffd7d3",
        },
      },
      {
        dark: {
          "primary": "#2481bd",
          "primary-content": "#000b14",
          "secondary": "#3598d4",
          "secondary-content": "#000a16",
          "accent": "#d35728",
          "accent-content": "#140100",
          "neutral": "#181818",
          "neutral-content": "#ccccc9",
          "base-100": "#1f1f1f",
          "base-200": "#181818",
          "base-300": "#171717",
          "base-content": "#d0d0d0",
          "info": "#4283c3",
          "info-content": "#d2e3f7",
          "success": "#25af5e",
          "success-content": "#010e01",
          "warning": "#efc514",
          "warning-content": "#160600",
          "error": "#e94c3d",
          "error-content": "#160204",
        },
      },
    ],
  },
}
```

You can see the changes on the page [I have provided here](/theme.html).