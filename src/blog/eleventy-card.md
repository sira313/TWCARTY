---
layout: main/post-blog.html  
title: Eleventy Card  
description: Eleventy Card is a starter project for photographers and artists to showcase their work and blog content.  
keywords: Eleventy, Bulma  
date: 2024-05-02  
tags:  
- Hello World  
---

**TWCARTY** (Tailwind Card Eleventy) is a starter project for photographers or artists to showcase their work and blog posts.

### Features
- Clean, simple, and responsive design  
- Automatic minification of HTML, CSS, and JS  
- Lazy image loading for improved performance  
- Integration with DaisyUI  
- Carousel for displaying photo galleries  
- Basic comment system included  

### Basic Info

#### Required Skills
- Git  
- NPM  
- HTML, CSS, and JavaScript (optional)

#### How to Get Started

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/sira313/twcarty
   ```

2. **Install PNPM globally**:  
   ```bash
   npm install -g pnpm
   ```

3. **Install the project dependencies**:  
   ```bash
   pnpm install
   ```

4. **Run the project locally**:  
   ```bash
   pnpm build && pnpm serve
   ```

5. **Modify the styles (optional)**:  
   If you need to modify the CSS, run the following command in a separate terminal:  
   ```bash
   pnpm watch:css
   ```

### Directory Structure
```bash
❯ tree
├───scripts
└───src
    ├───asset
    │   ├───blog
    │   ├───index
    │   └───photos
    │       └───thumbnail
    ├───blog
    ├───photos
    ├───_data
    ├───_includes
    │   ├───footer
    │   ├───index
    │   ├───js
    │   ├───main
    │   ├───nav
    │   ├───post
    │   └───search
    └───_pages
        ├───data
        ├───js
        ├───main
        └───tags
```

### Settings

- **Language**:  
  Update the language setting in `src/_includes/base.html`:  
  ```html
  <html lang="en">
  ```

- **Root URL**:  
  Set your website's root URL in `.eleventy.js`:  
  ```javascript
  // Root URL for the share button
  eleventyConfig.addGlobalData("rootURL", "https://yourwebsite.com");
  ```

### Social Media Buttons
Set up your social media links in `src/_data/sosmed.json`.  
You can use SVG icons from [Feather Icons](https://feathericons.com) or create your own with Inkscape.

### Menus
The project includes default menus for posts:  
- **Photos**  
- **Blog**  

To add a new menu, follow [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4).  
Don’t forget to update the collection in `.eleventy.js`:
```javascript
// Collections
const collectionConfigs = [
  { name: "posts", glob: "src/blog/**/*.md" },
  { name: "photos", glob: "src/photos/**/*.md" },
  { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
  { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 }
];
```
Also, update your menu files:  
- `src/_data/nav.json` for regular view  
- `src/_data/nav-mobile.json` for mobile view (under 300px)  

### Layouts
The project includes three layouts in `src/_includes`:
- **Main Layout**: `src/_includes/base.html` (used as the base for other layouts).  
- **Blog Post Layout**: `src/_includes/post-blog.html`.  
- **Photo Post Layout**: `src/_includes/post-photos.html`.

### Index Pages
All index pages are stored in `src/_pages`:
- **Main Index**: `src/index.md` (for your website’s main description).  
- **Photo Index**: `src/_pages/photos.html` (for displaying photos).  
- **Blog Index**: `src/_pages/blog.html` (for blog posts).

### Creating Posts
You can automate post creation with a script, so no manual work is required. [Thanks to my friend](https://github.com/mustofa-id).

To create a **blog post** in `/blog`:  
```bash
pnpm mkpost -b "Your post title"
```
This will create a markdown file in `/blog`.

To create a **photo post** in `/photos`:  
```bash
pnpm mkpost -p "Your post title"
```

### Assets
All assets are stored in the `/src/asset/` directory and referenced via front matter.

### Tips
For optimal image conversion to `.webp`, use [Squoosh](https://squoosh.app).  
Although I tried using `eleventy-img`, it didn’t fit my needs. You can [explore it here](https://www.11ty.dev/docs/plugins/image/).

## Like my work? Buy me a coffee! ☕  
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/aflasio)