---
layout: main/post-blog.html
title: Modify Theme
description: To change the default colors on this site, you can use the DaisyUI Theme Generator or manually customize them to suit your preferences.
keyword: Daisyui, theme generator, tailwindcss
date: 2024-08-04
tags:
 - Tutorial
---

To change the default colors on this site, you can use the [DaisyUI Theme Generator](https://daisyui.com/theme-generator/) or manually customize them to suit your preferences.

Here's the sample of `custom theme` that i used for my another project website [sdn19periji](https://sdn19periji.sch.id).
```
@plugin "daisyui/theme" {
  name: "light";
  default: true;
  prefersdark: false;
  color-scheme: "light";

  --color-primary: oklch(54.67% 0.187 259.84);
  --color-primary-content: oklch(100% 0 0);
  --color-secondary: oklch(63.17% 0.185 247.03);
  --color-secondary-content: oklch(100% 0 0);
  --color-accent: oklch(60.68% 0.275 28.48);
  --color-accent-content: oklch(100% 0 0);
  --color-neutral: oklch(100% 0 0);
  --color-neutral-content: oklch(12.91% 0.005 284.17);

  --color-base-100: oklch(100% 0 0);
  --color-base-200: oklch(95.69% 0 0);
  --color-base-300: oklch(90.58% 0 0);
  --color-base-content: oklch(12.91% 0.005 284.17);

  --color-info: oklch(65.64% 0.152 249.16);
  --color-info-content: oklch(2.56% 0.009 255.5);
  --color-success: oklch(66.74% 0.162 157.85);
  --color-success-content: oklch(5.91% 0.004 160.65);
  --color-warning: oklch(80.61% 0.172 78.78);
  --color-warning-content: oklch(4.24% 0.006 59.21);
  --color-error: oklch(48.23% 0.255 23.33);
  --color-error-content: oklch(100% 0 0);
}
@plugin "daisyui/theme" {
  name: "dark";
  default: false;
  prefersdark: true;
  color-scheme: "dark";

  --color-primary: oklch(54.67% 0.187 259.84);
  --color-primary-content: oklch(4.53% 0.007 260.69);
  --color-secondary: oklch(63.17% 0.185 247.03);
  --color-secondary-content: oklch(3.91% 0.005 249.02);
  --color-accent: oklch(60.68% 0.275 28.48);
  --color-accent-content: oklch(0% 0 0);
  --color-neutral: oklch(10.88% 0.005 284.17);
  --color-neutral-content: oklch(82.4% 0.001 284.17);

  --color-base-100: oklch(0.24 0 0);
  --color-base-200: oklch(0.22 0 0);
  --color-base-300: oklch(0.19 0 0);
  --color-base-content: oklch(83.94% 0.001 284.17);

  --color-info: oklch(65.64% 0.152 249.16);
  --color-info-content: oklch(100% 0 0);
  --color-success: oklch(66.74% 0.162 157.85);
  --color-success-content: oklch(1.59% 0.003 160.65);
  --color-warning: oklch(80.61% 0.172 78.78);
  --color-warning-content: oklch(0% 0 0);
  --color-error: oklch(48.23% 0.255 23.33);
  --color-error-content: oklch(0% 0 0);
}

```

You can see the changes on the page [I have provided here](/theme.html).