---
layout: post-blog.html 
title: Eleventy Card
description: Eleventy Card is a starter project for photographer/artist showing their work and blog randomly
keyword: Eleventy, Bulma
date: 2024-05-02
tags:
 - Hello World
---
Eleventy Card is a starter project for photographer/artist showing their work and blog randomly. I use `*.html` for default layout cause i don't understand nunjucks or any other. Everything i wrote to build this template is just copy paste, so...
>I apologize for any shortcomings as I am not a coder by background.

### Basic Info
Clone this repo
```
git clone https://github.com/sira313/eleventy-card-bulma/
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
pnpm start
```

#### Menu
There are 2 menus (for indexing post, not a single page) we created by default:
- Photos
- Blog

So if you wanted to create another one, maybe [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4) will help.
#### Layout
There are 3 layouts in `/_includes`:
- `/_includes/layout.html` is the main layout called in other layout frontmatter.
- `/_includes/post-blog.html` is for blog post layout.
- `/_includes/post-photos.html` is for photos post layout.
#### Index
There are 3 indexs in this project
- `/index.md` where you describe your own business.
- `/photos/index.html` is the index of all your photos.
- `/blog/index.html` is the index of your blog.
#### Post
Use strip instead of space for post name file. Exc: `your-title-post.md`
##### Photos
Post a work using markdown in `/photos` directory.
##### Blog
Write your blog using markdown in `/blog` directory.
#### Asset
All assets are in `/asset` directory and called in the frontmatter.
#### Tips
Better use [Squoosh](https://squoosh.app/) to convert your pics to webp

