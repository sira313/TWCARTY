---
layout: post-blog.html 
title: Eleventy Card
description: Eleventy Card is a starter project for photographer/artist showing their work and blog randomly
keyword: Eleventy, Bulma
date: 2024-05-02
tags:
 - Hello World
permalink: /blog/eleventy-card.html
---

**Eleventy Card** is a starter project for photographers and artists to showcase their work and blog posts randomly. I use `*.html` for the default layout because I don't fully understand Nunjucks or other templating languages. Everything I wrote to build this template was mostly copy-pasting, so...

>I apologize for any shortcomings, as I am not a coder by background.

### Features
- Responsive design
- Automatic minification of HTML, CSS, and JS
- Lazy loading of images
- Built with DaisyUI
- Carousel post gallery

### Installation Steps and Basic Information
>It's recommended to use Linux

1. Clone this repository:
   ```bash
   git clone https://github.com/sira313/twcarty
   ```
2. Install PNPM:
   ```bash
   npm install -g pnpm
   ```
3. Install the required modules:
   ```bash
   pnpm install
   ```
4. Run the project locally:
   ```bash
   pnpm serve
   ```
   You may need to split your terminal and run the command below if you need to modify the styles:
   ```bash
   pnpm watch:css
   ```

#### Directory Structure
```plaintext
src
├── assets
│   ├── index
│   │   └── cover.webp
│   └── photos
│       ├── thumbnail
│       │   └── warkop.jpg
│       └── warkop.jpg
├── blog
│   ├── eleventy-card.md
│   ├── index.html
│   └── tag.html
├── _includes
│   ├── base.html
│   ├── index.html
│   ├── post-blog.html
│   └── post-photos.html
├── index.md
├── photos
│   ├── index.html
│   ├── tag.html
│   └── warkop.md
└── styles.css
```

5. Modify your language settings first in [`/src/_includes/base.html`](https://github.com/sira313/TWCARTY/blob/7a51bfdcc55763dcb86c7d5d09076836704e02ce/src/_includes/base.html#L3):
   ```html
   <html lang="en">
   ```
6. Then update your root URL in [`/.eleventy.js`](https://github.com/sira313/TWCARTY/blob/7a51bfdcc55763dcb86c7d5d09076836704e02ce/.eleventy.js#L19):
   ```javascript
   // Root URL for the share button
   eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
   ```

#### Menus
There are 2 default menus for indexing posts (not single pages):
- Photos
- Blog

If you want to create another one, this [tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4) might help. Don't forget to add your new page to the collections in [`/.eleventy.js`](https://github.com/sira313/TWCARTY/blob/7a51bfdcc55763dcb86c7d5d09076836704e02ce/.eleventy.js#L26):
   ```javascript
   // Collections
   const collectionConfigs = [
     { name: "posts", glob: "src/blog/**/*.md" },
     { name: "photos", glob: "src/photos/**/*.md" },
     { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
     { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 }
   ];
   ```

#### Layouts
There are 3 main layouts in [`/src/_includes`](https://github.com/sira313/TWCARTY/tree/main/src/_includes):
- [`/src/_includes/base.html`](https://github.com/sira313/TWCARTY/blob/main/src/_includes/base.html): This is the main layout, called in other layout frontmatter.
- [`/src/_includes/post-blog.html`](https://github.com/sira313/TWCARTY/blob/main/src/_includes/post-blog.html): This is the layout for blog posts.
- [`/src/_includes/post-photos.html`](https://github.com/sira313/TWCARTY/blob/main/src/_includes/post-photos.html): This is the layout for photo posts.

#### Index Pages
There are 3 index pages in this project:
- [`/src/index.md`](https://github.com/sira313/TWCARTY/blob/main/src/index.md): This is where you describe your own business.
- [`/src/photos/index.html`](https://github.com/sira313/TWCARTY/blob/main/src/photos/index.html): This is the index of all your photos.
- [`/src/blog/index.html`](https://github.com/sira313/TWCARTY/blob/main/src/blog/index.html): This is the index of your blog.

#### Creating a Post
We have a script that automatically creates posts, so you don't need to do it manually. [Thanks to my friend](https://github.com/mustofa-id).

To create a post in `/blog`, you need to run:
   ```bash
   pnpm mkpost -b "Your post title"
   ```
This will create a markdown file in `/blog`.

If you want to create a post in `/photos`, run:
   ```bash
   pnpm mkpost -p "Your post title"
   ```

#### Assets
All assets are stored in the [`/src/assets`](https://github.com/sira313/TWCARTY/tree/main/src/assets) directory and are referenced in the frontmatter.

#### Tips
It's recommended to use [Squoosh](https://squoosh.app/) to convert your images to `.webp`.

I've tried `eleventy-img`, but it doesn't seem suitable for me because it generates too many images, which clutters the output directory. If you want to try it yourself, you can check it out [here](https://www.11ty.dev/docs/plugins/image/).