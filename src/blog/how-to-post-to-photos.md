---
layout: main/post-blog.html
title: How to post to photos
description: A short description to use this starter to post your pics to gallery.
keyword: eleventy, tutorial, post.
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


Similar to the [previous tutorial about posting to the blog](/blog/how-to-post-in-blog), but this time I'm giving you some tips. First, we need to set the frontmatter. We need to set up the cover and the thumbnail.

```markdown
---
layout: main/post-photos.html
title: Daun
description: hac habitasse platea dictumst. Nunc hendrerit ultrices lectus, sed facilisis nisi lacinia quis.
keyword: Habitase, dictumst
cover:
    - url: /asset/photos/daun.webp
    - url: /asset/photos/daun.webp
thumbnail: /asset/photos/thumbnail/daun.webp
date: 2024-04-21
tags: Tumbuhan
---
```

Use [Squoosh](https://squoosh.app/) to convert and compress your images to webp. It's better for performance, trust me.

Put the real images in the `/asset/photos/` directory. You can post 2 or more photos in the cover that will show in a carousel. Next, you need to scale the images to a maximum width of 300px, and still use webp. Put them into `/asset/photos/thumbnail`.

The cover will show in the post, and the thumbnail will show in the index.
>Just like that
