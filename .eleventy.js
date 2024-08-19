const { execSync } = require('child_process');
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  
  // Add lazyImages and Files Minifier plugins
  eleventyConfig.addPlugin(lazyImagesPlugin);
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // Run Pagefind after Eleventy build is complete
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx -y pagefind --site _site --output-subdir _pagefind`, { encoding: 'utf-8' });
  });

  // Add Tailwind config to the watch target
  eleventyConfig.addWatchTarget("tailwind.config.js");

  // Add global data for the root URL
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");

  // Passthrough Copy for files and folders to the output
  const passthroughCopies = ["src/robots.txt", "src/assets"];
  passthroughCopies.forEach(path => eleventyConfig.addPassthroughCopy(path));

  // Define custom collections
  const collectionConfigs = [
    { name: "posts", glob: "src/blog/**/*.md" },
    { name: "photos", glob: "src/photos/**/*.md" },
    { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
    { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 }
  ];

  // Loop to create collections based on the above configurations
  collectionConfigs.forEach(config => {
    eleventyConfig.addCollection(config.name, function(collectionApi) {
      let items = collectionApi.getFilteredByGlob(config.glob);
      return config.limit ? items.reverse().slice(0, config.limit) : items;
    });
  });

  // Add tag collections for blog and photos
  ["blog", "photos"].forEach(type => {
    eleventyConfig.addCollection(`${type}Tags`, getTags(type));
  });

  // Filter to get the first image from a cover image array
  eleventyConfig.addFilter("firstCoverImage", function(cover) {
    if (Array.isArray(cover) && cover.length > 0) {
      return cover[0].url;
    }
    return cover;
  });

  // Filter to limit the number of words in a string
  eleventyConfig.addLiquidFilter("limitWords", function(str, wordLimit) {
    let words = str.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return str;
  });
  
  /**
   * Function to get unique tags from a collection
   * @param {'blog'|'photos'} type - The collection type (blog or photos)
   * @returns {Array} - Array of unique tags
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

  // Directory configuration for input and output
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
