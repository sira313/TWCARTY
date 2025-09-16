// scripts/dashboard.js
import express from "express";
import bodyParser from "body-parser";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

const app = express();
const PORT = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));

// folder post
const postDirs = {
  blog: resolve("src/blog"),
  photos: resolve("src/photos"),
};

// helper baca file markdown
function getPosts(type) {
  const dir = postDirs[type];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      slug: f,
      content: readFileSync(join(dir, f), "utf8"),
    }));
}

// 🟢 form new post (beda untuk blog dan photos)
app.get("/dashboard/:type/new", (req, res) => {
  const { type } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");

  let extraFields = "";
  if (type === "blog") {
    extraFields = `
      <input name="description" placeholder="Description" class="input input-bordered" />
      <input name="keyword" placeholder="Keyword (comma separated)" class="input input-bordered" />
      <input name="tags" placeholder="Tags (comma separated)" class="input input-bordered" />
    `;
  } else if (type === "photos") {
    extraFields = `
      <input name="description" placeholder="Description" class="input input-bordered" />
      <input name="keyword" placeholder="Keyword (comma separated)" class="input input-bordered" />
      <textarea name="cover" placeholder="Cover URLs (one per line)" class="textarea textarea-bordered"></textarea>
      <input name="thumbnail" placeholder="Thumbnail URL" class="input input-bordered" />
      <input name="tags" placeholder="Tags (comma separated)" class="input input-bordered" />
    `;
  }

  res.send(`
  <html>
  <head><script src="https://cdn.tailwindcss.com"></script></head>
  <body class="p-6">
    <h1 class="text-xl font-bold mb-4">New ${type} Post</h1>
    <form method="post" action="/dashboard/${type}/save" class="flex flex-col gap-4">
      <input name="slug" placeholder="Slug (tanpa .md)" class="input input-bordered" required />
      <input name="title" placeholder="Title" class="input input-bordered" required />
      ${extraFields}
      <textarea name="content" placeholder="Content" class="textarea textarea-bordered h-40"></textarea>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </body>
  </html>
  `);
});

// 🟢 save new post
app.post("/dashboard/:type/save", (req, res) => {
  const { type } = req.params;
  const { slug, title, description, keyword, tags, cover, thumbnail, content } = req.body;

  const filePath = join(postDirs[type], slug + ".md");
  const date = new Date().toISOString().split("T")[0];

  let frontmatter = "";

  if (type === "blog") {
    frontmatter = `---
layout: main/post-blog.html
title: ${title}
description: ${description || "TODO"}
keyword: ${keyword || ""}
date: ${date}
tags:
  ${tags ? tags.split(",").map((t) => `- ${t.trim()}`).join("\n  ") : "- TODO"}
---

${content || "# TODO"}
`;
  } else if (type === "photos") {
    // cover jadi array url
    const coverArray = cover
      ? cover
          .split("\n")
          .map((url) => `  - url: ${url.trim()}`)
          .join("\n")
      : "";

    frontmatter = `---
layout: main/post-photos.html
title: ${title}
description: ${description || "TODO"}
keyword: ${keyword || ""}
cover:
${coverArray}
thumbnail: ${thumbnail || ""}
date: ${date}
tags: ${tags || "TODO"}
---

${content || "# TODO"}
`;
  }

  writeFileSync(filePath, frontmatter);
  res.redirect(`/dashboard/${type}`);
});

// 🟢 edit existing post (langsung textarea)
app.get("/dashboard/:type/edit/:slug", (req, res) => {
  const { type, slug } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");

  const file = join(postDirs[type], slug);
  const content = readFileSync(file, "utf8");

  res.send(`
  <html>
  <head><script src="https://cdn.tailwindcss.com"></script></head>
  <body class="p-6">
    <h1 class="text-xl font-bold mb-4">Edit ${slug}</h1>
    <form method="post" action="/dashboard/${type}/update/${slug}" class="flex flex-col gap-4">
      <textarea name="content" class="textarea textarea-bordered h-[600px]">${content}</textarea>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </body>
  </html>
  `);
});

// 🟢 update file (overwrite)
app.post("/dashboard/:type/update/:slug", (req, res) => {
  const { type, slug } = req.params;
  const { content } = req.body;

  const filePath = join(postDirs[type], slug);
  writeFileSync(filePath, content);

  res.redirect(`/dashboard/${type}`);
});

// 🟢 list posts
app.get("/dashboard/:type", (req, res) => {
  const type = req.params.type;
  if (!postDirs[type]) return res.status(404).send("Invalid type");

  const posts = getPosts(type);
  const list = posts
    .map(
      (p) =>
        `<li><a class="link" href="/dashboard/${type}/edit/${p.slug}">${p.slug}</a></li>`
    )
    .join("");

  res.send(`
  <html>
  <head><script src="https://cdn.tailwindcss.com"></script></head>
  <body class="p-6">
    <h1 class="text-xl font-bold mb-4">${type.toUpperCase()} Posts</h1>
    <ul class="list-disc pl-6">${list}</ul>
    <a href="/dashboard/${type}/new" class="btn btn-success mt-6">+ New Post</a>
  </body>
  </html>
  `);
});

// 🟢 halaman utama dashboard
app.get("/dashboard", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-6 bg-base-200">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div class="flex gap-6">
      <a href="/dashboard/blog" class="btn btn-primary">Blog</a>
      <a href="/dashboard/photos" class="btn btn-secondary">Photos</a>
    </div>
  </body>
  </html>
  `);
});

app.listen(PORT, () =>
  console.log(`🚀 Dashboard running at http://localhost:${PORT}/dashboard`)
);
