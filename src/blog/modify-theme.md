---
layout: main/post-blog.html
title: Modify Theme
description: To change the default colors on this site, you can use the DaisyUI Theme Generator or manually customize them to suit your preferences.
keyword: Daisyui, theme generator, tailwindcss
date: 2024-08-04
tags:
 - Tutorial
---

<div class="not prose">
<div role="alert" class="alert alert-info">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>Update April 2025: Upgrade to Tailwind 4 and DaisyUI 5</span>
</div>
</div>

To change the default colors on this site, you can use the [DaisyUI Theme Generator](https://daisyui.com/theme-generator/) or manually customize them to suit your preferences.

Here's the sample of `custom theme` that i used in this site.
```
@plugin "daisyui/theme" {
  name: "light";
  default: true;
  prefersdark: false;
  color-scheme: "light";

  --color-primary: oklch(0.55 0.1527 254.17);
  --color-primary-content: oklch(1 0 0);
  --color-secondary: oklch(0.64 0.1596 253.5);
  --color-secondary-content: oklch(1 0 0);
  --color-accent: oklch(0.65 0.2018 24.74);
  --color-accent-content: oklch(1 0 0);
  --color-neutral: oklch(1 0 0);
  --color-neutral-content: oklch(0.24 0 0);

  --color-base-100: oklch(100% 0 0);
  --color-base-200: oklch(95.69% 0 0);
  --color-base-300: oklch(90.58% 0 0);
  --color-base-content: oklch(0.2 0.0025 325.67);

  --color-info: oklch(0.6 0.1188 250.15);
  --color-info-content: oklch(0.12 0.0467 259.88);
  --color-success: oklch(0.7 0.16 158.77);
  --color-success-content: oklch(0.18 0.036 168.03);
  --color-warning: oklch(0.8 0.1549 74.9);
  --color-warning-content: oklch(0.14 0.029 83.02);
  --color-error: oklch(0.56 0.1927 26.08);
  --color-error-content: oklch(1 0 0);
}
@plugin "daisyui/theme" {
  name: "dark";
  default: false;
  prefersdark: true;
  color-scheme: "dark";

  --color-primary: oklch(0.55 0.1527 254.17);
  --color-primary-content: oklch(0.14 0.0302 235.42);
  --color-secondary: oklch(0.64 0.1596 253.5);
  --color-secondary-content: oklch(0.14 0.0344 244.02);
  --color-accent: oklch(0.65 0.2018 24.74);
  --color-accent-content: oklch(0 0 0);
  --color-neutral: oklch(0.21 0 0);
  --color-neutral-content: oklch(0.84 0.0041 106.49);

  --color-base-100: oklch(0.24 0 0);
  --color-base-200: oklch(0.22 0 0);
  --color-base-300: oklch(0.19 0 0);
  --color-base-content: oklch(0.86 0 0);

  --color-info: oklch(0.6 0.1188 250.15);
  --color-info-content: oklch(1 0 0);
  --color-success: oklch(0.7 0.16 158.77);
  --color-success-content: oklch(0.14 0.0429 142.94);
  --color-warning: oklch(0.8 0.1549 74.9);
  --color-warning-content: oklch(0 0 0);
  --color-error: oklch(0.56 0.1927 26.08);
  --color-error-content: oklch(0 0 0);
}

```

You can see the changes on the page [I have provided here](/theme.html).
