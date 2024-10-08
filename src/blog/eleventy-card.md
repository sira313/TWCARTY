---
layout: main/post-blog.html 
title: Eleventy Card
description: Eleventy Card is a starter project for photographer/artist showing their work and blog randomly
keyword: Eleventy, Bulma
date: 2024-05-02
tags:
 - Hello World
---

**TWCARTY** (Tailwind Card Eleventy) An eleventy starter project for photographers or artists to showcase their work and blog.

### Features
- Clean, simple, and responsive design
- Auto-minifies HTML, CSS, and JS
- Lazy loading of images
- DaisyUI integration
- Carousel post gallery

### Basic Info

#### Required skills

- Git
- NPM
- Html and css (opsional)

#### How to

Clone the repository
```
git clone https://github.com/sira313/twcarty
```
Install PNPM globally
```
npm install -g pnpm
```
Install the project dependencies
```
pnpm install
```
Run the project locally
```
pnpm build && pnpm serve
```
If you wanted to modify the style, you may need to run this command below in split terminal
```
pnpm watch:css
```

#### Directory Structure
```bash
❯ tree
.
├── src
│   ├── 404.html
│   ├── asset
│   │   ├── index
│   │   │   ├── cover.webp
│   │   │   ├── favicon.ico
│   │   │   └── profile.webp
│   │   └── photos
│   │       ├── chick.webp
│   │       ├── chicks2.webp
│   │       ├── thumbnail
│   │       │   ├── toko.webp
│   │       │   └── warkop.webp
│   │       └── warkop.webp
│   ├── blog
│   │   ├── eleventy-card.md
│   │   ├── how-to-post-in-blog.md
│   ├── _data
│   │   ├── nav.json
│   │   ├── nav-mobile.json
│   │   └── sosmed.json
│   ├── _includes
│   │   ├── base.html
│   │   ├── comment.html
│   │   ├── footer-credit.html
│   │   ├── footer-sosmed.html
│   │   ├── index.html
│   │   ├── post-blog.html
│   │   ├── post-photos.html
│   │   ├── profile.html
│   │   ├── recent.html
│   │   ├── search-global.html
│   │   └── search.html
│   ├── index.md
│   ├── _pages
│   │   ├── 404.html
│   │   ├── blog.html
│   │   ├── photos.html
│   │   ├── search-data.html
│   │   ├── search.html
│   │   ├── tag-blog.html
│   │   ├── tag-photos.html
│   │   └── theme.html
│   ├── photos
│   │   ├── Toko.md
│   │   └── warkop.md
│   └── styles.css
└── tailwind.config.js
```

#### Settings
- **Language**: Update the language setting in [src/_includes/base.html](https://github.com/sira313/TWCARTY/blob/main/src/_includes/base.html#L3):
  ```html
  <html lang="en">
  ```
- **Root URL**: Set your root URL in [.eleventy.js](https://github.com/sira313/TWCARTY/blob/main/.eleventy.js#L19):
  ```javascript
  // Root URL for the share button
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
  ```

#### Social media buttons
Set your social media in `src/_data/sosmed.json`
Use svg icon you can download from anywhere like [feathericons](https://feathericons.com
) or create your own with inkscape

#### Menu
The project includes two default menus for post indexing:
- Photos
- Blog

To add another menu, follow [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4). Don’t forget to update the collection in [.eleventy.js](https://github.com/sira313/TWCARTY/blob/main/.eleventy.js#L26-L27):
```javascript
// Collections
const collectionConfigs = [
  { name: "posts", glob: "src/blog/**/*.md" },
  { name: "photos", glob: "src/photos/**/*.md" },
  { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
  { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 }
];
```
Also, add your new menu in `src/_data`.
- `src/_data/nav.json` for regular view
- `src/_data/nav-mobile.json` for mobile view below 300px

#### Layouts
There are three layouts in `src/_includes`:
- **Main Layout**: `src/_includes/base.html`, referenced in other layouts.
- **Blog Post Layout**: `src/_includes/post-blog.html`.
- **Photo Post Layout**: `src/_includes/post-photos.html`.

#### Index Pages
All pages store in `src/_pages`. But the project includes three index pages:
- **Main Index**: `src/index.md` for describing your business.
- **Photo Index**: `src/_pages/photos.html` for all your photos.
- **Blog Index**: `src/_pages/blog.html` for your blog posts.

#### Creating Posts
A script is available to automate post creation, so manual work is not necessary. [Thanks to my friend](https://github.com/mustofa-id).

To create a blog post in `/blog`:
```
pnpm mkpost -b "Your post title"
```
This will create a markdown file in `/blog`.

To create a photo post in `/photos`:
```
pnpm mkpost -p "Your post title"
```

#### Assets
All assets are stored in the `/src/asset/` directory and referenced in the front matter.

#### Tips
For optimal image conversion to `.webp`, use [Squoosh](https://squoosh.app/).

I tried using eleventy-img, but it didn’t quite fit my needs. Feel free to [explore it yourself](https://www.11ty.dev/docs/plugins/image/).

## Like my work? Gimme a cup coffee 😉
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/aflasio) 
