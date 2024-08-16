## TWCARTY
A starter project for photographer/artist showing their work and blog randomly

[![twcarty.netlify.app](https://img.shields.io/badge/LIVE-twcarty.netlify.app-blue?style=for-the-badge)](https://twcarty.netlify.app/)

[![apoxi.cam](https://img.shields.io/badge/SAMPLE-apoxi.cam-blue?style=for-the-badge)](https://apoxi.cam/)

Powered by:

[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev/)[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)[![DaisyUI](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)

---

### Features
- Responsive
- Auto minify html, css, and js
- Lazy load images
- Using DaisyUI
- Carousel post gallery

### Basic Info
Better use Linux

Clone this repo
```
git clone https://github.com/sira313/twcarty
```
Use PNPM
```
npm install -g pnpm
```
Install modules
```
pnpm install
```
Run to your localhost 
```
pnpm build && pnpm serve
```
Directory Tree
```
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
Modify your language first in [/src/_includes/base.html](https://github.com/sira313/TWCARTY/blob/4a69eaa27e836443707ecb1e1a10fea311a42cba/_includes/base.html#L2)
```
<html lang="en">
```
Then your root url in [/.eleventy.js](https://github.com/sira313/TWCARTY/blob/4a69eaa27e836443707ecb1e1a10fea311a42cba/.eleventy.js#L21)
```javascript
// root url for share button
eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
```

#### Menu
There are 2 menus (for indexing post, not a single page) we created by default:
- Photos
- Blog

So if you wanted to create another one, maybe [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4) will help. And don't forget to add your new page to collection in [/.eleventy.js](https://github.com/sira313/TWCARTY/blob/4a69eaa27e836443707ecb1e1a10fea311a42cba/.eleventy.js#L32)
```javascript
// Collection post blog
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/**/*.md");
  });

// Collection post photos
  eleventyConfig.addCollection("photos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("photos/**/*.md");
  });
```
Don't forget to add your new menu in [/src/_data](/src/_data/)

#### Layout
There are 3 layouts in [/src/_includes](/src/_includes/):
- [/src/_includes/base.html](/src/_includes/base.html) is the main layout called in other layout frontmatter.
- [/src/_includes/post-blog.html](/src/_includes/post-blog.html) is for blog post layout.
- [/src/_includes/post-photos.html](/src/_includes/post-photos.html) is photos post layout.
#### Index
There are 3 indexs in this project
- [/src/index.md](/src/index.md) where you describe your own business.
- [/src/photos/index.html](/src/photos/index.html) is the index of all your photos.
- [/src/blog/index.html](/src/blog/index.html) is the index of your blog.
#### Post
We created a js script to make a post automatically, so you don't need to do that manual. [Thanks to my friend](https://github.com/mustofa-id).

To create a post in `/blog` you need to
```
pnpm mkpost -b Your post title
```
It will create a markdown file in `/blog`.

And if you wanted to create a post in `/photos` you just need to
```
pnpm mkpost -p Your post title
```
#### Asset
All assets are in [/src/assets](/src/assets/) directory and called in the frontmatter.
#### Tips
Better use [Squoosh](https://squoosh.app/) to convert your pics to *.webp

I've tried eleventy-img but it seems less suitable for me. If you wanna try it, try it [yourself](https://www.11ty.dev/docs/plugins/image/).
