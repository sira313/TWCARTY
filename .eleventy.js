module.exports = function(eleventyConfig) {
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