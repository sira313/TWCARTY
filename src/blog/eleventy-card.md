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
Eleventy Card is a starter project for photographer/artist showing their work and blog randomly. I use `*.html` for default layout cause i don't understand nunjucks or any other. Everything i wrote to build this template is just copy paste, so...
>I apologize for any shortcomings as I am not a coder by background.

### Basic Info
Clone this repository:
```
git clone https://github.com/sira313/twcarty
```
Use PNPM:
```
npm install -g pnpm
```
Install modules:
```
pnpm install
```
Run on your localhost:
```
pnpm build && pnpm serve
```

#### Menu
There are 2 menus (for indexing posts, not single pages) created by default:
- Photos
- Blog

If you want to create another one, this [tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4) might help.

#### Layout
There are 3 layouts in `/_includes`:
- `/_includes/layout.html` is the main layout referenced in other layout frontmatter.
- `/_includes/post-blog.html` is for blog post layout.
- `/_includes/post-photos.html` is for photos post layout.

#### Index
There are 3 indexes in this project:
- `/index.md` where you describe your business.
- `photos/index.html` is the index of all your photos.
- `/blog/index.html` is the index of your blog.

#### Post
We created a JavaScript script to make posting automatic, so you don't need to do it manually. [Thanks to my friend](https://github.com/mustofa-id).

To create a post in `/blog`, you need to run:
```
pnpm mkpost -b "Your post title"
```
It will create a markdown file in `/blog`.

If you want to create a post in `/photos`, you just need to run:
```
pnpm mkpost -p "Your post title"
```

#### Assets
All assets are in the `/assets` directory and referenced in the frontmatter.

#### Tips
It's better to use [Squoosh](https://squoosh.app/) to convert your images to webp.
