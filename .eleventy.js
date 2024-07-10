module.exports = function(eleventyConfig) {
  // tailwind
  eleventyConfig.addWatchTarget("tailwind.config.js");
  // root url
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
  // Passthrough copy untuk menyalin file statis ke output
  eleventyConfig.addPassthroughCopy("site/assets");

  // Collection post blog
	eleventyConfig.addCollection("posts", function (collectionApi) {
		return collectionApi.getFilteredByGlob("site/blog/**/*.md");
	});

	// Collection post photos
	eleventyConfig.addCollection("photos", function (collectionApi) {
		return collectionApi.getFilteredByGlob("site/photos/**/*.md");
	});

  // Input output dir
  return {
    dir: {
      input: "site",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};