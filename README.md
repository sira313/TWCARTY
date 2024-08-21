## TWCARTY
An eleventy starter project for photographers or artists to showcase their work and blog.

[![twcarty.netlify.app](https://img.shields.io/badge/LIVE-twcarty.netlify.app-blue?style=for-the-badge)](https://twcarty.netlify.app/)  
[![apoxi.cam](https://img.shields.io/badge/SAMPLE-apoxi.cam-blue?style=for-the-badge)](https://apoxi.cam/)

Powered by:

[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev/)[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)[![DaisyUI](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)

---

### Features
- Clean, simple, and responsive design
- Auto-minifies HTML, CSS, and JS
- Lazy loading of images
- DaisyUI integration
- Carousel post gallery

### Basic Info

#### Required skills

- Git
- NPM
- Html and css (opsional)

#### How to

Clone the repository
```
git clone https://github.com/sira313/twcarty
```
Install PNPM globally
```
npm install -g pnpm
```
Install the project dependencies
```
pnpm install
```
Run the project locally
```
pnpm build && pnpm serve
```
If you wanted to modify the style, you may need to run this command below in split terminal
```
pnpm watch:css
```

#### Directory Structure
```
src
├── 404.html
├── assets
│   ├── index
│   │   ├── cover.webp
│   │   ├── favicon.ico
│   │   └── profile.webp
│   └── photos
│       ├── motor2.jpg
│       ├── motor.jpg
│       ├── thumbnail
│       │   ├── toko.jpg
│       │   └── warkop.jpg
│       └── warkop.jpg
├── blog
│   ├── eleventy-card.md
│   ├── how-to-post-in-blog.md
│   ├── how-to-post-to-photos.md
│   ├── index.html
│   └── tag.html
├── _data
│   ├── nav.json
│   └── nav-mobile.json
├── _includes
│   ├── base.html
│   ├── footer-credit.html
│   ├── index.html
│   ├── post-blog.html
│   ├── post-photos.html
│   ├── profile.html
│   ├── recent.html
│   └── sosmed.html
├── index.md
├── photos
│   ├── Anak-Ayam.md
│   ├── daun.md
│   ├── index.html
│   ├── tag.html
│   └── warkop.md
├── styles.css
└── theme.html
```

#### Settings
- **Language**: Update the language setting in [src/_includes/base.html](https://github.com/sira313/TWCARTY/blob/main/src/_includes/base.html#L3):
  ```html
  <html lang="en">
  ```
- **Root URL**: Set your root URL in [.eleventy.js](https://github.com/sira313/TWCARTY/blob/main/.eleventy.js#L19):
  ```javascript
  // Root URL for the share button
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
  ```

#### Menu
The project includes two default menus for post indexing:
- Photos
- Blog

To add another menu, follow [this tutorial](https://www.youtube.com/watch?v=kzf9A9tkkl4). Don’t forget to update the collection in [.eleventy.js](https://github.com/sira313/TWCARTY/blob/main/.eleventy.js#L26-L27):
```javascript
// Collections
const collectionConfigs = [
  { name: "posts", glob: "src/blog/**/*.md" },
  { name: "photos", glob: "src/photos/**/*.md" },
  { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
  { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 }
];
```
Also, add your new menu in [src/_data](/src/_data/).

#### Layouts
There are three layouts in [src/_includes](/src/_includes/):
- **Main Layout**: [src/_includes/base.html](/src/_includes/base.html), referenced in other layouts.
- **Blog Post Layout**: [src/_includes/post-blog.html](/src/_includes/post-blog.html).
- **Photo Post Layout**: [src/_includes/post-photos.html](/src/_includes/post-photos.html).

#### Index Pages
The project includes three index pages:
- **Main Index**: [src/index.md](/src/index.md) for describing your business.
- **Photo Index**: [src/photos/index.html](/src/photos/index.html) for all your photos.
- **Blog Index**: [src/blog/index.html](/src/blog/index.html) for your blog posts.

#### Creating Posts
A script is available to automate post creation, so manual work is not necessary. [Thanks to my friend](https://github.com/mustofa-id).

To create a blog post in `/blog`:
```
pnpm mkpost -b "Your post title"
```
This will create a markdown file in `/blog`.

To create a photo post in `/photos`:
```
pnpm mkpost -p "Your post title"
```

#### Assets
All assets are stored in the [/src/assets](/src/assets/) directory and referenced in the front matter.

#### Tips
For optimal image conversion to `.webp`, use [Squoosh](https://squoosh.app/).

I tried using eleventy-img, but it didn’t quite fit my needs. Feel free to [explore it yourself](https://www.11ty.dev/docs/plugins/image/).

## Like my work, gimme coffee 😉
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/aflasio) 
