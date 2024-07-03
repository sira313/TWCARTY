module.exports = function(eleventyConfig) {
  // tailwind
  eleventyConfig.addWatchTarget("tailwind.config.js");
  // root url
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
  // Passthrough copy untuk menyalin file statis ke output
  eleventyConfig.addPassthroughCopy("site/assets");

  // Atur direktori input dan output
  return {
    dir: {
      input: "site",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};