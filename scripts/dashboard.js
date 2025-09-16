// scripts/dashboard.js
import express from "express";
import bodyParser from "body-parser";
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { resolve, join } from "path";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(resolve("public"))); // Untuk aset statis jika ada

// Konfigurasi direktori post
const postDirs = {
  blog: resolve("src/blog"),
  photos: resolve("src/photos"),
};

// --- Helper Functions ---

/**
 * Membuat kerangka HTML dasar dengan DaisyUI dan Drawer
 * @param {string} title - Judul halaman
 * @param {string} content - Konten HTML utama
 * @returns {string} - String HTML lengkap
 */
function createHtmlShell(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | Dashboard</title>
      <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet" type="text/css" />
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-base-100 min-h-screen">
      <div class="drawer xl:drawer-open">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
          <!-- Navbar -->
          <div class="navbar sticky top-0 z-50 bg-base-300 shadow-lg w-full">
            <div class="flex-none">
              <label for="my-drawer" class="btn btn-square btn-ghost drawer-button xl:hidden" aria-label="open sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
            </div>
            <div class="flex-1">
              <a href="/dashboard" class="btn btn-ghost text-xl">🚀 Eleventy Dashboard</a>
            </div>
          </div>
          <!-- Page Content -->
          <main class="p-4 sm:p-6 md:p-8">
            ${content}
          </main>
        </div> 
        <div class="drawer-side z-10">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li class="menu-title"><span>Manage Content</span></li>
            <li><a href="/dashboard/blog">✍️ Blog Posts</a></li>
            <li><a href="/dashboard/photos">🖼️ Photo Galleries</a></li>
          </ul>
        </div>
      </div>

      <dialog id="delete_modal" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Confirm Deletion</h3>
          <p class="py-4">Are you sure you want to delete this post? This action cannot be undone.</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Cancel</button>
            </form>
            <form id="delete_form" method="post">
              <button type="submit" class="btn btn-error">Delete</button>
            </form>
          </div>
        </div>
      </dialog>
      <script>
        function confirmDelete(actionUrl) {
          const modal = document.getElementById('delete_modal');
          const form = document.getElementById('delete_form');
          form.action = actionUrl;
          modal.showModal();
        }
      </script>
    </body>
    </html>
  `;
}

/**
 * Membaca semua post dari direktori dan mengekstrak judul dari frontmatter.
 * @param {string} type - 'blog' or 'photos'
 * @returns {Array<{slug: string, title: string}>}
 */
function getPosts(type) {
  const dir = postDirs[type];
  if (!dir) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = readFileSync(join(dir, f), "utf8");
      const titleMatch = content.match(/^title:\s*(.*)/m);
      return {
        slug: f,
        title: titleMatch ? titleMatch[1].replace(/"/g, '') : f, // Menghapus quote jika ada
      };
    }).sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Mem-parsing frontmatter dan konten dari file markdown.
 * @param {string} content - Konten file mentah.
 * @returns {object} - Objek berisi data frontmatter dan body.
 */
function parseFrontmatter(content) {
    const frontmatterMatch = content.match(/---([\s\S]*?)---/);
    if (!frontmatterMatch) return { body: content };

    const frontmatterStr = frontmatterMatch[1];
    const body = content.substring(frontmatterMatch[0].length).trim();
    
    const data = {};
    const lines = frontmatterStr.split('\n');
    let currentKey = null;
    let isList = false;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        const simpleMatch = line.match(/^(\w+):\s*(.*)/);
        if (simpleMatch) {
            currentKey = simpleMatch[1];
            const value = simpleMatch[2];
            if (value) {
                data[currentKey] = value;
                isList = false;
            } else {
                data[currentKey] = [];
                isList = true;
            }
        } else if (isList && line.startsWith('-')) {
            if (currentKey === 'tags') {
                 data[currentKey].push(line.replace(/-\s*/, ''));
            } else if (currentKey === 'cover' && line.includes('url:')) {
                 data[currentKey].push(line.replace(/-\s*url:\s*/, ''));
            }
        }
    });
    
    // Konversi array ke string untuk form
    if (data.tags && Array.isArray(data.tags)) data.tags = data.tags.join(', ');
    if (data.cover && Array.isArray(data.cover)) data.cover = data.cover.join('\n');

    return { ...data, body };
}


/**
 * Membuat konten file markdown dari data form.
 * @param {string} type - 'blog' or 'photos'
 * @param {object} body - req.body dari form
 * @returns {string}
 */
function createMarkdownContent(type, body) {
  const { slug, title, description, keyword, tags, cover, thumbnail, content } = body;
  const date = body.date || new Date().toISOString().split("T")[0];

  if (type === "blog") {
    return `---
layout: main/post-blog.html
title: "${title}"
description: "${description || "TODO"}"
keyword: "${keyword || ""}"
date: ${date}
tags:
${tags ? tags.split(",").map((t) => `  - ${t.trim()}`).join("\n") : "  - TODO"}
---

${content || "# TODO"}
`;
  } else if (type === "photos") {
    const coverArray = cover
      ? cover.split("\n").map((url) => `  - url: ${url.trim()}`).join("\n")
      : "";
    return `---
layout: main/post-photos.html
title: "${title}"
description: "${description || "TODO"}"
keyword: "${keyword || ""}"
cover:
${coverArray}
thumbnail: ${thumbnail || ""}
date: ${date}
tags: ${tags ? `\n${tags.split(",").map(t => `  - ${t.trim()}`).join("\n")}` : "TODO"}
---

${content || "# TODO"}
`;
  }
  return "";
}


// --- Routes ---

// 🟢 Halaman utama dashboard
app.get("/dashboard", (req, res) => {
  const content = `
    <div class="hero min-h-[calc(100vh-12rem)] bg-base-200 rounded-box">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome Back!</h1>
          <p class="py-6">Manage your content with ease. Use the menu to navigate between your blog posts and photo galleries.</p>
          <label for="my-drawer" class="btn btn-primary drawer-button xl:hidden">Open Menu</label>
        </div>
      </div>
    </div>
  `;
  res.send(createHtmlShell("Dashboard", content));
});


// 🟢 Menampilkan daftar post dalam tabel
app.get("/dashboard/:type", (req, res) => {
  const { type } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");

  const posts = getPosts(type);
  const tableRows = posts.map(p => `
    <tr>
      <td class="font-medium">${p.title}</td>
      <td class="text-right">
        <div class="flex justify-end gap-2">
          <a href="/dashboard/${type}/edit/${p.slug}" class="btn btn-sm btn-outline btn-info">Edit</a>
          <button onclick="confirmDelete('/dashboard/${type}/delete/${p.slug}')" class="btn btn-sm btn-outline btn-error">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  const content = `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold capitalize">${type} Posts</h1>
      <a href="/dashboard/${type}/new" class="btn btn-primary">+ New ${type} Post</a>
    </div>
    <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows || `<tr><td colspan="2" class="text-center">No posts found.</td></tr>`}
                </tbody>
              </table>
            </div>
        </div>
    </div>
  `;
  res.send(createHtmlShell(`${type.toUpperCase()} Posts`, content));
});


// 🟢 Form untuk post baru atau edit
const renderForm = (type, post = {}) => {
  const isNew = !post.slug;
  const actionUrl = isNew ? `/dashboard/${type}/save` : `/dashboard/${type}/update/${post.slug}`;
  
  let extraFields = "";
  if (type === "blog") {
    extraFields = `
      <div class="form-control"><label class="label"><span class="label-text">Description</span></label><input name="description" placeholder="Post description" class="input input-bordered w-full" value="${post.description || ''}" /></div>
      <div class="form-control"><label class="label"><span class="label-text">Keyword</span></label><input name="keyword" placeholder="SEO keywords" class="input input-bordered w-full" value="${post.keyword || ''}" /></div>
      <div class="form-control"><label class="label"><span class="label-text">Tags (comma separated)</span></label><input name="tags" placeholder="e.g. tech, eleventy, js" class="input input-bordered w-full" value="${post.tags || ''}" /></div>
    `;
  } else if (type === "photos") {
    extraFields = `
      <div class="form-control"><label class="label"><span class="label-text">Description</span></label><input name="description" placeholder="Gallery description" class="input input-bordered w-full" value="${post.description || ''}" /></div>
      <div class="form-control"><label class="label"><span class="label-text">Keyword</span></label><input name="keyword" placeholder="SEO keywords" class="input input-bordered w-full" value="${post.keyword || ''}" /></div>
      <div class="form-control"><label class="label"><span class="label-text">Cover URLs (one per line)</span></label><textarea name="cover" placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg" class="textarea textarea-bordered h-24">${post.cover || ''}</textarea></div>
      <div class="form-control"><label class="label"><span class="label-text">Thumbnail URL</span></label><input name="thumbnail" placeholder="https://example.com/thumb.jpg" class="input input-bordered w-full" value="${post.thumbnail || ''}" /></div>
      <div class="form-control"><label class="label"><span class="label-text">Tags (comma separated)</span></label><input name="tags" placeholder="e.g. nature, travel" class="input input-bordered w-full" value="${post.tags || ''}" /></div>
    `;
  }
  
  return `
    <div class="max-w-5xl mx-auto">
        <a href="/dashboard/${type}" class="btn btn-link mb-4">← Back to ${type} list</a>
        <div class="card bg-base-200 shadow-lg">
            <div class="card-body">
                <h1 class="card-title text-2xl mb-4">${isNew ? `New ${type} Post` : `Edit "${post.title}"`}</h1>
                <form method="post" action="${actionUrl}" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label"><span class="label-text">Slug (filename without .md)</span></label>
                      <input name="slug" placeholder="my-awesome-post" class="input input-bordered w-full" required value="${isNew ? '' : post.slug.replace('.md', '')}" ${isNew ? '' : 'disabled'} />
                    </div>
                    <div class="form-control">
                      <label class="label"><span class="label-text">Title</span></label>
                      <input name="title" placeholder="My Awesome Post" class="input input-bordered w-full" required value="${post.title || ''}" />
                    </div>
                  </div>
                  ${extraFields}
                  <div class="form-control">
                    <label class="label"><span class="label-text">Content (Markdown)</span></label>
                    <textarea name="content" placeholder="# Your content here" class="textarea textarea-bordered h-64">${post.body || ''}</textarea>
                  </div>
                  <input type="hidden" name="date" value="${post.date || ''}" />
                  <div class="card-actions justify-end">
                    <button type="submit" class="btn btn-primary">${isNew ? 'Save Post' : 'Update Post'}</button>
                  </div>
                </form>
            </div>
        </div>
    </div>
  `;
};

app.get("/dashboard/:type/new", (req, res) => {
  const { type } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");
  res.send(createHtmlShell(`New ${type} Post`, renderForm(type)));
});

// 🟢 Menampilkan form edit dengan data yang sudah terisi
app.get("/dashboard/:type/edit/:slug", (req, res) => {
    const { type, slug } = req.params;
    if (!postDirs[type]) return res.status(404).send("Invalid type");
    
    try {
        const fileContent = readFileSync(join(postDirs[type], slug), "utf8");
        const postData = parseFrontmatter(fileContent);
        postData.slug = slug;
        res.send(createHtmlShell(`Edit ${postData.title}`, renderForm(type, postData)));
    } catch (error) {
        console.error(error);
        res.status(404).send("File not found");
    }
});


// 🟢 Menyimpan post baru
app.post("/dashboard/:type/save", (req, res) => {
  const { type } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");
  
  const { slug } = req.body;
  const filePath = join(postDirs[type], slug + ".md");
  const markdownContent = createMarkdownContent(type, req.body);
  
  writeFileSync(filePath, markdownContent);
  res.redirect(`/dashboard/${type}`);
});

// 🟢 Mengupdate post yang ada
app.post("/dashboard/:type/update/:slug", (req, res) => {
    const { type, slug } = req.params;
    if (!postDirs[type]) return res.status(404).send("Invalid type");

    // Karena slug di-disable di form, kita ambil dari URL params
    const updatedBody = { ...req.body, slug: slug.replace('.md', '') };
    
    const filePath = join(postDirs[type], slug);
    const markdownContent = createMarkdownContent(type, updatedBody);
    
    writeFileSync(filePath, markdownContent);
    res.redirect(`/dashboard/${type}`);
});

// 🟢 Menghapus post
app.post("/dashboard/:type/delete/:slug", (req, res) => {
  const { type, slug } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");

  try {
    const filePath = join(postDirs[type], slug);
    unlinkSync(filePath);
    res.redirect(`/dashboard/${type}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete file.");
  }
});


// Menjalankan server
app.listen(PORT, () =>
  console.log(`🚀 Dashboard running at http://localhost:${PORT}/dashboard`)
);

