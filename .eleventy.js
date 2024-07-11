const { execSync } = require('child_process')
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function(eleventyConfig) {
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

  // Passthrough copy untuk menyalin file statis ke output
  eleventyConfig.addPassthroughCopy("site/assets");

  // Collection post blog
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/blog/**/*.md");
  });

  // Collection post photos
  eleventyConfig.addCollection("photos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/photos/**/*.md");
  });

  // Collection tags
  eleventyConfig.addCollection("blogTags", getTags("blog"));
  eleventyConfig.addCollection("photosTags", getTags("photos"));

  // Input output dir
  return {
    dir: {
      input: "site",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };

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
