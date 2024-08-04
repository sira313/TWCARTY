const { execSync } = require('child_process');
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  // cover for meta tag
  eleventyConfig.addFilter("firstCoverImage", function(cover) {
    if (Array.isArray(cover) && cover.length > 0) {
      return cover[0].url;
    }
    return cover;
  });

  // lazyimages
  eleventyConfig.addPlugin(lazyImagesPlugin);

  // minifier
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // pagefind
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx -y pagefind --site _site --output-subdir _pagefind`, { encoding: 'utf-8' });
  });

  // tailwind
  eleventyConfig.addWatchTarget("tailwind.config.js");

  // root url
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");

  // Passthrough copy asset
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Passthrough copy robots.txt
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Passthrough copy 404.html
  eleventyConfig.addPassthroughCopy({ "src/404.html": "404.html" });

  // Passthrough copy styles.css
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });

  // Collection post blog
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/**/*.md");
  });

  // Collection post photos
  eleventyConfig.addCollection("photos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/photos/**/*.md");
  });

  // Recent post blog
  eleventyConfig.addCollection("recentPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").reverse().slice(0, 3);
  });

  // Recent post photos
  eleventyConfig.addCollection("recentPhotos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/photos/*.md").reverse().slice(0, 4);
  });

  // Collection tags
  eleventyConfig.addCollection("blogTags", getTags("blog"));
  eleventyConfig.addCollection("photosTags", getTags("photos"));

  /**
   * @param {'blog'|'photos'} type
   */
  function getTags(type) {
    return (collection) => {
      let tagsSet = new Set();
      collection.getAll().forEach((item) => {
        if (item.filePathStem.includes(`/${type}/`) && item.data.tags) {
          item.data.tags.forEach((tag) => {
            tagsSet.add(tag);
          });
        }
      });
      return Array.from(tagsSet);
    };
  }

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
