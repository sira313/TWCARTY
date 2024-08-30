---
layout: main/post-blog.html
title: How to post to photos
description: A short description to use this starter to post your pics to gallery.
keyword: eleventy, tutorial, post.
date: 2024-05-02
tags:
    - Tutorial
---
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