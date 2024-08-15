const { execSync } = require('child_process');
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  // Plugin lazyimages dan minifier
  eleventyConfig.addPlugin(lazyImagesPlugin);
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // Pagefind
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx -y pagefind --site _site --output-subdir _pagefind`, { encoding: 'utf-8' });
  });

  // Watch Tailwind config
  eleventyConfig.addWatchTarget("tailwind.config.js");

  // Set root URL
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");

  // Passthrough Copy
  const passthroughCopies = ["src/robots.txt", "src/assets"];
  passthroughCopies.forEach(path => eleventyConfig.addPassthroughCopy(path));

  // Collections
  const collectionConfigs = [
    { name: "posts", glob: "src/blog/**/*.md" },
    { name: "photos", glob: "src/photos/**/*.md" },
    { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
    { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 }
  ];

  collectionConfigs.forEach(config => {
    eleventyConfig.addCollection(config.name, function(collectionApi) {
      let items = collectionApi.getFilteredByGlob(config.glob);
      return config.limit ? items.reverse().slice(0, config.limit) : items;
    });
  });

  // Collection Tags
  ["blog", "photos"].forEach(type => {
    eleventyConfig.addCollection(`${type}Tags`, getTags(type));
  });

  // Filter for cover image in meta tag
  eleventyConfig.addFilter("firstCoverImage", function(cover) {
    if (Array.isArray(cover) && cover.length > 0) {
      return cover[0].url;
    }
    return cover;
  });

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
