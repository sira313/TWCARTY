const { execSync } = require('child_process')
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  // lazyimages
  eleventyConfig.addPlugin(lazyImagesPlugin);

  // minifier
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
  
  // pagefind
  eleventyConfig.on('eleventy.after', () => {
		execSync(`npx -y pagefind --site _site --output-subdir _pagefind`, { encoding: 'utf-8' })
	})

  // tailwind
  eleventyConfig.addWatchTarget("tailwind.config.js");

  // root url
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");

  // Passthrough copy asset
  eleventyConfig.addPassthroughCopy("assets");

  // Collection post blog
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/**/*.md");
  });

  // Collection post photos
  eleventyConfig.addCollection("photos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("photos/**/*.md");
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
};
