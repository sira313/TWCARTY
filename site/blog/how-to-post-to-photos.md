---
layout: post-blog.html
title: How to post to photos
description: A short description to use this starter to post your pics to gallery.
keyword: eleventy, tutorial, post.
date: 2024-05-02
tags:
    - Tutorial
---
Same as [previous tutorial about post to blog](/blog/how-to-post-in-blog), but this time i'm giving you some tips. First of all, we need to set the frontmatter. We need to set up the cover and the thumbail.
```
---
layout: post-photos.html
title: Daun
description: hac habitasse platea dictumst. Nunc hendrerit ultrices lectus, sed facilisis nisi lacinia quis.
keyword: Habitase, dictumst
cover: /asset/photos/daun.jpg
thumbnail: /asset/photos/thumbnail/daun.jpg
date: 2024-04-21
tags: Tumbuhan
---
```
Use [squoosh](https://squoosh.app/) to convert and compress your images to webp, it's better for performance, trust me.
Put the real image to `/asset/photos/` directory. 
Next, you need to scale it to max width 300px and still, we use webp. Put it into `/asst/photos/thumbnail`.
Cover will show in the post, thumbail will show in the index.
>Just like that