---
layout: main/post-blog.html
title: How to make a blog post
description: A short description to use this starter to post your log to blog.
keyword: eleventy, tutorial
date: 2024-05-02
tags:
  - Tutorial
---

<div role="alert" class="alert alert-success not-prose">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>There is new way to post. We have a simple CMS run locally. <a class="link" href="/blog/simple-cms-dashboard/">READ HERE</a></span>
</div>

To create a blog post, simply run this command:
```
pnpm mkpost -b Your Blog Title
```

It will create a new markdown file in `/blog` directory

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
