const { execSync } = require('child_process');
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  // cover for meta tag
  eleventyConfig.addFilter("firstCoverImage", cover => {
    return Array.isArray(cover) && cover.length > 0 ? cover[0].url : cover;
  });

  // lazyimages
  eleventyConfig.addPlugin(lazyImagesPlugin);

  // minifier
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // pagefind
  eleventyConfig.on('eleventy.after', () => {
    execSync('npx -y pagefind --site _site --output-subdir _pagefind', { encoding: 'utf-8' });
  });

  // tailwind
  eleventyConfig.addWatchTarget('tailwind.config.js');

  // root url
  eleventyConfig.addGlobalData('rootURL', 'https://twcarty.netlify.app');

  // Passthrough copy assets
  eleventyConfig.addPassthroughCopy({
    'src/assets': 'assets',
    'src/robots.txt': 'robots.txt',
    'src/404.html': '404.html',
    'src/styles.css': 'styles.css'
  });

  // Collections
  const createCollection = (globPattern, limit) => collectionApi => 
    collectionApi.getFilteredByGlob(globPattern).reverse().slice(0, limit);

  eleventyConfig.addCollection('posts', collectionApi => 
    collectionApi.getFilteredByGlob('src/blog/**/*.md')
  );

  eleventyConfig.addCollection('photos', collectionApi => 
    collectionApi.getFilteredByGlob('src/photos/**/*.md')
  );

  eleventyConfig.addCollection('recentPosts', createCollection('src/blog/*.md', 3));
  eleventyConfig.addCollection('recentPhotos', createCollection('src/photos/*.md', 4));

  // Collection tags
  eleventyConfig.addCollection('blogTags', getTags('blog'));
  eleventyConfig.addCollection('photosTags', getTags('photos'));

  function getTags(type) {
    return collection => {
      const tagsSet = new Set();
      collection.getAll().forEach(item => {
        if (item.filePathStem.includes(`/${type}/`) && item.data.tags) {
          item.data.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      return Array.from(tagsSet);
    };
  }

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};
