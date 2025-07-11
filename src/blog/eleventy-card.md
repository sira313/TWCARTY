---
layout: main/post-blog.html
title: Eleventy Card
description: Eleventy Card is a starter project for photographers and artists to showcase their work and blog content.
keywords: Eleventy, Bulma
date: 2024-05-02
tags:
  - Hello World
---

**TWCARTY** is a minimal, responsive starter template for photographers and artists to showcase their work and blog posts.

### Features

- Clean and modern design
- Automatic minification of HTML, CSS, and JS
- Lazy loading for images to improve performance
- Built-in DaisyUI integration
- Carousel for photo galleries
- Simple comment system included

### Getting Started

#### Requirements

Basic knowledge of:

- Git
- NPM
- HTML & CSS (JavaScript is optional)

#### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/sira313/twcarty
   ```

2. **Install PNPM globally**

   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Run the project**
   ```bash
   pnpm run dev
   ```

### Project Structure

```
scripts/
src/
├── asset/
│   ├── blog/
│   ├── index/
│   └── photos/
│       └── thumbnail/
├── blog/
├── photos/
├── _data/
├── _includes/
│   ├── footer/
│   ├── index/
│   ├── js/
│   ├── main/
│   ├── nav/
│   ├── post/
│   └── search/
└── _pages/
    ├── data/
    ├── js/
    ├── main/
    └── tags/
```

### Configuration

#### Global Data

In `.eleventy.js`, you can set global site data:

```js
eleventyConfig.addGlobalData("lang", "en");
eleventyConfig.addGlobalData("rootTitle", "Apoxicam");
eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
eleventyConfig.addGlobalData(
  "quotes",
  "<i>No one comes to your website to be entertained...</i><br /><b>― Jay Baer</b>"
);
```

### Social Media Links

Edit `src/_data/sosmed.json` to include your social media.  
Use [Feather Icons](https://feathericons.com) or custom SVGs made in Inkscape.

### Menus

Default menus:

- Photos
- Blog

To add more menus, follow [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4)  
Update your collections in `.eleventy.js`:

```js
const collectionConfigs = [
  { name: "posts", glob: "src/blog/**/*.md" },
  { name: "photos", glob: "src/photos/**/*.md" },
  { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
  { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 },
];
```

Also update:

- `src/_data/nav.json` for desktop view
- `src/_data/nav-mobile.json` for screens < 300px

### Layouts

Defined in `src/_includes/`:

- `base.html` – main layout
- `post-blog.html` – for blog posts
- `post-photos.html` – for photo posts

### Index Pages

Located in `src/_pages/`:

- `index.md` – homepage
- `photos.html` – photo gallery
- `blog.html` – blog listing

### Creating Posts

Use the helper script to automate post creation:

- For **blog posts**:

  ```bash
  pnpm mkpost -b "Your post title"
  ```

- For **photo posts**:
  ```bash
  pnpm mkpost -p "Your post title"
  ```

These will generate Markdown files in their respective folders.

### Assets

Images and other assets are stored in `/src/asset/`  
You can link them from the front matter in your posts.

### Image Optimization

Use [Squoosh](https://squoosh.app) to convert images to `.webp` for better performance.  
While `eleventy-img` is available, it didn’t match this project’s needs. Feel free to [explore it here](https://www.11ty.dev/docs/plugins/image/).

### Support

If you find this project helpful, you can support me here:

[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/aflasio)
