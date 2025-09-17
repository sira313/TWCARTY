---
layout: main/post-blog.html
title: Simple CMS
description: A simple CMS for static sites. Edit, preview, and manage content easily with a modern UI powered by Tailwind CSS and DaisyUI.
keyword: CMS, Dashboard, eleventy, ssg
date: 2025-09-17
tags:
  - Tutorial
---

![dashboard](/asset/blog/dashboard.png)

This starter project has a simple CMS (Content Management System) dashboard built with Node.js, Tailwind CSS, and DaisyUI. It is designed to help you manage website content easily without complicated setup.

### Purpose

The dashboard lets you create, edit, and manage your website’s content from a user-friendly interface. It is suitable for personal blogs, small business sites, or any static site that needs easy content updates.

### Features

- **Content Editing:** Add and edit posts or pages directly from the dashboard.
- **Markdown Support:** Write content in Markdown and preview it instantly.
- **Live Preview:** See how your content will look before publishing.
- **Image Upload:** Upload images to use in your posts.
- **Modern UI:** Uses Tailwind CSS and DaisyUI for a clean, responsive design.
- **Local Assets:** All CSS and JS are loaded locally for fast performance and offline development.

### How to Use

1. **Install Dependencies**
   ```
   pnpm install
   ```

2. **Start the CMS**
   ```
   pnpm run cms:dev
   ```
   This will build the CSS and start the dashboard server.

3. **Open the Dashboard**
   Visit [http://localhost:3000/cms](http://localhost:3000/cms) in your browser.

4. **Create or Edit Content**
   Use the dashboard interface to add new posts, edit existing ones, and upload images.

5. **Preview and Save**
   Preview your content in real-time and save changes when ready.
6. **Open your website** Split terminal and run
   ```
   pnpm run dev
   ```

### Summary

This simple CMS dashboard makes managing your content easy and efficient. With a modern design and essential features, you can focus on writing and publishing without worrying about technical details.
