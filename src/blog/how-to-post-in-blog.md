---
layout: main/post-blog.html
title: How to post in blog
description: A short description to use this starter to post your log to blog.
keyword: eleventy, tutorial
date: 2024-05-02
tags:
    - Tutorial
---

Create a new file in the `/blog` directory. Do not use blank spaces; use `-` instead. For example:
```
how-to-create-post-in-blog.md
```
Since we use markdown, refer to this [markdown cheat sheet](https://www.markdownguide.org/cheat-sheet/) as a guide. Do not forget our default frontmatter:
```
---
layout: main/post-blog.html
title: How to post in blog
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec cursus tortor. Ut eu quam consequat, gravida massa vel, luctus diam. Duis congue lacus eget magna faucibus sodales. Curabitur laoreet justo in libero faucibus, at laoreet risus lacinia.
keyword: eleventy, tutorial
cover: /asset/blog/cover.webp
date: 2024-04-21
tags:
    - Tutorial
---
```
Explanation:
- `layout`: This is the layout we use for the blog UI. If you want to change it, go to `_includes/post-blog.html`.
- `title`: This is your post title.
- `description`: This is a short text about your post. It will appear in the meta tag and the post index.
- `keyword`: These keywords will be used in the meta tag.
- `date`: Use the format yyyy-mm-dd.
- `tags`: Tags will be used as categories. You can set two or more.
- `cover` : Cover needed for meta tag