## TWCARTY
#### A starter project for photographer/artist showing their work and blog randomly
#### [twcarty.netlify.app](https://twcarty.netlify.app/) 
[![Netlify Status](https://api.netlify.com/api/v1/badges/5ed3a8c6-b9ef-4ecd-86d8-1ef8ab1f6c9d/deploy-status)](https://app.netlify.com/sites/twcarty/deploys)

Powered by 

[![Eleventy](https://a11ybadges.com/badge?logo=eleventy)](https://www.11ty.dev/)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)![DaisyUI](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

---

### Basic Info
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

#### Menu
There are 2 menus (for indexing post, not a single page) we created by default:
- Photos
- Blog

So if you wanted to create another one, maybe [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4) will help.
#### Layout
There are 3 layouts in [/_includes](/_includes/):
- [/_includes/base.html](/_includes/base.html) is the main layout called in other layout frontmatter.
- [/_includes/post-blog.html](/_includes/post-blog.html) is for blog post layout.
- [/_includes/post-photos.html](/_includes/post-photos.html) is photos post layout.
#### Index
There are 3 indexs in this project
- [/index.md](/index.md) where you describe your own business.
- [/photos/index.html](/photos/index.html) is the index of all your photos.
- [/blog/index.html](/blog/index.html) is the index of your blog.
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
All assets are in [/asset](/asset/) directory and called in the frontmatter.
#### Tips
Better use [Squoosh](https://squoosh.app/) to convert your pics to webp
