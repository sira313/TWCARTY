// scripts/dashboard.js
import express from "express";
import bodyParser from "body-parser";
import { readdirSync, readFileSync, writeFileSync, unlinkSync, statSync, mkdirSync, rmdirSync } from "fs";
import { resolve, join, dirname } from "path";
import multer from "multer";

const app = express();
const PORT = 3000;
const ASSET_DIR = resolve("src/asset"); // Direktori root baru untuk explorer

// Konfigurasi Multer untuk file upload ke ASSET_DIR
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Path tujuan upload diambil dari form, di-resolve terhadap ASSET_DIR
    const uploadPath = join(ASSET_DIR, req.body.path || "/");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Gunakan nama file asli
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(resolve("public")));
// Sajikan direktori aset secara statis di path /assets
app.use('/assets', express.static(ASSET_DIR));


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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
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
            <li class="menu-title"><span>Utilities</span></li>
            <li><a href="/dashboard/explorer">🗂️ File Explorer</a></li>
          </ul>
        </div>
      </div>

      <dialog id="delete_modal" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Confirm Deletion</h3>
          <p class="py-4">Are you sure you want to delete this item? This action cannot be undone.</p>
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
        function confirmDelete(actionUrl, isFileExplorer = false) {
          const modal = document.getElementById('delete_modal');
          const form = document.getElementById('delete_form');
          if (isFileExplorer) {
            form.action = '/dashboard/explorer/delete';
            let pathInput = form.querySelector('input[name="path"]');
            if (!pathInput) {
              pathInput = document.createElement('input');
              pathInput.type = 'hidden';
              pathInput.name = 'path';
              form.appendChild(pathInput);
            }
            pathInput.value = actionUrl;
          } else {
            form.action = actionUrl;
            let pathInput = form.querySelector('input[name="path"]');
            if (pathInput) pathInput.remove();
          }
          modal.showModal();
        }

        function copyToClipboard(text, buttonElement) {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          // Make the textarea invisible
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            if (buttonElement) {
              const originalText = buttonElement.innerHTML;
              buttonElement.innerHTML = 'Copied!';
              buttonElement.classList.add('btn-success');
              setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove('btn-success');
              }, 1500);
            }
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
          document.body.removeChild(textarea);
        }
      </script>
    </body>
    </html>
  `;
}
// ... existing getPosts, parseFrontmatter, createMarkdownContent functions ...
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
          <p class="py-6">Manage your content with ease. Use the menu to navigate between your blog posts, photo galleries, and the file explorer.</p>
          <label for="my-drawer" class="btn btn-primary drawer-button xl:hidden">Open Menu</label>
        </div>
      </div>
    </div>
  `;
  res.send(createHtmlShell("Dashboard", content));
});


// --- File Explorer Routes (MOVED UP) ---
app.get("/dashboard/explorer", (req, res) => {
    const relativePath = req.query.path || "/";
    const currentPath = resolve(ASSET_DIR, relativePath.substring(1));

    // Security check: Pastikan path masih di dalam ASSET_DIR
    if (!currentPath.startsWith(ASSET_DIR)) {
        return res.status(400).send("Invalid path");
    }

    const breadcrumbs = relativePath.split('/').filter(Boolean);

    const files = readdirSync(currentPath).map(file => {
        const stats = statSync(join(currentPath, file));
        return {
            name: file,
            isDirectory: stats.isDirectory(),
            // FIX: Ganti backslash dengan forward slash untuk URL
            path: join(relativePath, file).replace(/\\/g, '/')
        };
    }).sort((a, b) => { // Sort folders first, then by name
        if (a.isDirectory !== b.isDirectory) {
            return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });

    const fileList = files.map(f => `
      <tr>
        <td>
          <a href="${f.isDirectory ? `/dashboard/explorer?path=${f.path}` : `/assets${f.path}`}" 
             ${f.isDirectory ? '' : `target="_blank" rel="noopener noreferrer"`} 
             class="flex items-center gap-2 link ${f.isDirectory ? 'link-primary' : 'link-hover'}">
            ${f.isDirectory ? '📁' : '📄'} ${f.name}
          </a>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-2">
            ${!f.isDirectory ? `<button onclick="copyToClipboard('/assets${f.path}', this)" class="btn btn-xs btn-outline btn-primary">Copy Link</button>` : ''}
            <button onclick="confirmDelete('${f.path}', true)" class="btn btn-xs btn-outline text-error">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
    
    const breadcrumbLinks = breadcrumbs.map((part, index) => {
        const path = '/' + breadcrumbs.slice(0, index + 1).join('/');
        return `<li><a href="/dashboard/explorer?path=${path}">${part}</a></li>`;
    }).join('');

    const content = `
        <div class="text-sm breadcrumbs">
            <ul>
                <li><a href="/dashboard/explorer?path=/">asset</a></li>
                ${breadcrumbLinks}
            </ul>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div class="lg:col-span-2 card bg-base-200 shadow-lg">
                <div class="card-body">
                    <h2 class="card-title">Files in ${relativePath === '/' ? '/asset' : `/asset${relativePath}`}</h2>
                    <div class="overflow-x-auto">
                        <table class="table">
                            <tbody>${fileList.length > 0 ? fileList : '<tr><td class="text-center italic opacity-75">Folder is empty</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="space-y-6">
                <div class="card bg-base-200 shadow-lg">
                    <div class="card-body">
                        <h2 class="card-title">Upload File</h2>
                        <form action="/dashboard/explorer/upload" method="post" enctype="multipart/form-data" class="space-y-4">
                            <input type="hidden" name="path" value="${relativePath}" />
                            <div class="form-control">
                               <input type="file" name="file" class="file-input file-input-bordered w-full" required />
                            </div>
                            <button type="submit" class="btn btn-primary w-full">Upload</button>
                        </form>
                    </div>
                </div>
                <div class="card bg-base-200 shadow-lg">
                    <div class="card-body">
                        <h2 class="card-title">Create Folder</h2>
                        <form action="/dashboard/explorer/new-folder" method="post" class="space-y-4">
                            <input type="hidden" name="path" value="${relativePath}" />
                            <div class="form-control">
                                <input type="text" name="folderName" placeholder="New folder name" class="input input-bordered w-full" required />
                            </div>
                            <button type="submit" class="btn btn-secondary w-full">Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    res.send(createHtmlShell("File Explorer", content));
});

app.post('/dashboard/explorer/upload', upload.single('file'), (req, res) => {
    // Redirect kembali ke path tempat file diupload
    res.redirect(`/dashboard/explorer?path=${req.body.path || '/'}`);
});

app.post('/dashboard/explorer/new-folder', (req, res) => {
    const { path, folderName } = req.body;
    if (!folderName) return res.status(400).send("Folder name is required.");

    const fullPath = join(ASSET_DIR, path || '/', folderName);
    
    // Security check
    if (!fullPath.startsWith(ASSET_DIR)) {
        return res.status(400).send("Invalid path.");
    }

    try {
        mkdirSync(fullPath);
        res.redirect(`/dashboard/explorer?path=${path || '/'}`);
    } catch(err) {
        console.error(err);
        res.status(500).send("Failed to create directory.");
    }
});

app.post('/dashboard/explorer/delete', (req, res) => {
    const relativePath = req.body.path;
    if (!relativePath) return res.status(400).send("Path is required.");

    const fullPath = resolve(ASSET_DIR, relativePath.substring(1));

    // Security check
    if (!fullPath.startsWith(ASSET_DIR)) {
        return res.status(400).send("Invalid path");
    }

    try {
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            // Hanya hapus folder jika kosong
            if (readdirSync(fullPath).length === 0) {
                rmdirSync(fullPath);
            } else {
                return res.status(400).send("Folder is not empty.");
            }
        } else {
            unlinkSync(fullPath);
        }
        
        // Redirect ke folder parent dari item yang dihapus
        const parentDir = dirname(relativePath);
        res.redirect(`/dashboard/explorer?path=${parentDir}`);
    } catch(err) {
        console.error(err);
        res.status(500).send("Failed to delete item.");
    }
});


// 🟢 Menampilkan daftar post dalam tabel
app.get("/dashboard/:type", (req, res) => {
  const { type } = req.params;
  // This check now correctly ignores 'explorer' because that route is handled above
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
                    
                    <div role="tablist" class="tabs tabs-lifted">
                      <input type="radio" name="editor_tabs" role="tab" class="tab" aria-label="Write" checked />
                      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-0">
                        <textarea name="content" id="markdown-input" placeholder="# Your content here" class="textarea w-full h-96 rounded-box rounded-tl-none">${post.body || ''}</textarea>
                      </div>

                      <input type="radio" name="editor_tabs" role="tab" class="tab" aria-label="Preview" />
                      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-b-box rounded-tr-box p-6">
                        <div id="markdown-preview" class="prose max-w-none prose-invert"></div>
                      </div>
                    </div>

                  </div>
                  <input type="hidden" name="date" value="${post.date || ''}" />
                  <div class="card-actions justify-end">
                    <button type="submit" class="btn btn-primary">${isNew ? 'Save Post' : 'Update Post'}</button>
                  </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const markdownInput = document.getElementById('markdown-input');
        const markdownPreview = document.getElementById('markdown-preview');

        function updatePreview() {
          const rawHTML = marked.parse(markdownInput.value);
          markdownPreview.innerHTML = DOMPurify.sanitize(rawHTML);
        }

        markdownInput.addEventListener('input', updatePreview);

        // Initial preview
        updatePreview();
      });
    </script>
  `;
};

app.get("/dashboard/:type/new", (req, res) => {
  const { type } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");
  res.send(createHtmlShell(`New ${type} Post`, renderForm(type)));
});

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

app.post("/dashboard/:type/save", (req, res) => {
  const { type } = req.params;
  if (!postDirs[type]) return res.status(404).send("Invalid type");
  
  const { slug } = req.body;
  const filePath = join(postDirs[type], slug + ".md");
  const markdownContent = createMarkdownContent(type, req.body);
  
  writeFileSync(filePath, markdownContent);
  res.redirect(`/dashboard/${type}`);
});

app.post("/dashboard/:type/update/:slug", (req, res) => {
    const { type, slug } = req.params;
    if (!postDirs[type]) return res.status(404).send("Invalid type");
    const updatedBody = { ...req.body, slug: slug.replace('.md', '') };
    const filePath = join(postDirs[type], slug);
    const markdownContent = createMarkdownContent(type, updatedBody);
    writeFileSync(filePath, markdownContent);
    res.redirect(`/dashboard/${type}`);
});

app.post("/dashboard/:type/delete/:slug", (req, res) => {
  const { type } = req.params;
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
