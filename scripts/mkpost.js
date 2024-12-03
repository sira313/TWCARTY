// @ts-check

/**
 * @typedef { '-b' | '-p' } Post_Type
 */

const { existsSync, writeFileSync } = require("fs");
const { resolve } = require("path");

// get 3rd cli args as post type
const type = /** @type {Post_Type} */ (process.argv[2]);

// and the rest will joined as title
const title = process.argv.slice(3).join(" ");

// check if type value is passed
if (!type) {
    console.error(`⚠ type is required. Either use '-b' or '-p'.\n`);
    process.exit(1);
}

// check title value passed
if (!title) {
    console.error(`⚠ title is required\n`);
    process.exit(1);
}

// check type value
if (!["-b", "-p"].includes(type)) {
    console.error(`⚠ type must be '-b' for blog or '-p' for photo\n`);
    process.exit(1);
}

// map post directories with post type
/** @type {Record<Post_Type, string>} */
const post_dirs = { "-b": "./src/blog", "-p": "./src/photos" };

// map post layouts with post type
/** @type {Record<Post_Type, string>} */
const post_layouts = { "-b": "main/post-blog.html", "-p": "main/post-photos.html" };

// map permalink paths with post type
/** @type {Record<Post_Type, string>} */
const permalink_paths = { "-b": "/blog/", "-p": "/photos/" };

// create slug from title that sliced to 5 words
const slug = title.toLocaleLowerCase().split(/\s+/g).slice(0, 5).join("-");

// resolve post file that make use of slug
const post_file = resolve(post_dirs[type], slug + ".md");

// check if post file already exists
if (existsSync(post_file)) {
    console.error(
        `⚠ post with slug "${slug}" already exists in "${post_dirs[type]}".\n`
    );
    process.exit(1);
}

// format frontmatter based on type
let frontmatter = '';
if (type === '-b') {
    frontmatter = `---
layout: ${post_layouts[type]}
title: ${title.toLowerCase().replace(/(?:^|\s)\w/g, (m) => m.toUpperCase())}
description: TODO
keyword: TODO
cover: /asset/blog/
date: ${new Date().toISOString().split("T")[0]}
tags:
 - TODO
---

# TODO
`;
} else if (type === '-p') {
    frontmatter = `---
layout: ${post_layouts[type]}
title: ${title.toLowerCase().replace(/(?:^|\s)\w/g, (m) => m.toUpperCase())}
description: TODO
keyword: TODO
cover:
  - url: /asset/photos/
thumbnail: /asset/photos/thumbnail/
date: ${new Date().toISOString().split("T")[0]}
tags:
  - TODO
---

# TODO
`;
}

// write frontmatter to a post file
writeFileSync(post_file, frontmatter);

console.log(`✔ post created:`, post_file);
