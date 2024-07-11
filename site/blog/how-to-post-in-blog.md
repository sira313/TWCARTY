---
layout: post-blog.html
title: How to post in blog
description: A short description to use this starter to post your log to blog.
keyword: eleventy, tutorial
date: 2024-05-02
tags:
    - Tutorial
---
Create a new file in `/blog` directory. Do not use blank space, use `-` instead. For example
```
how-to-create-post-in-blog.md
```
Since we use markdown, we need this [markdown cheat sheet](https://www.markdownguide.org/cheat-sheet/) for our guide.
Do not forget our default frontmatter
```
---
layout: post-blog.html
title: How to post in blog
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec cursus tortor. Ut eu quam consequat, gravida massa vel, luctus diam. Duis congue lacus eget magna faucibus sodales. Curabitur laoreet justo in libero faucibus, at laoreet risus lacinia.
keyword: eleventy, tutorial
date: 2024-04-21
tags:
    - Tutorial
---
```
Explanation:
- `layout` is the layout we use for this blog UI, if you want to change it, go to `_includes/post-blog.html`
- `title` is your post title.
- `description` is the short text about your post, it will show in the meta tag and the index of post.
- `keyword` we'll use it in the meta tag.
- `data` use format yyyy-mm-dd.
- `tags` tag will use as categories, you can set it two or more.