import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

import eleventyPluginFilesMinifier from "@sherby/eleventy-plugin-files-minifier";
import lazyImagesPlugin from "eleventy-plugin-lazyimages";

if (process.env.NODE_ENV?.toLocaleLowerCase() !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

export default function (eleventyConfig) {
  // minifier js
  import("./scripts/minify.js")
    .then((minifyModule) => {
      eleventyConfig.addTransform(
        "minify",
        minifyModule.default || minifyModule
      );
    })
    .catch((error) =>
      console.error("Error importing minify transform:", error)
    );

  // lazyImages and Files Minifier
  eleventyConfig.addPlugin(lazyImagesPlugin, {
    appendInitScript: false, // disable cdn script
  });
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // Global data for root
  eleventyConfig.addGlobalData("lang", "en"); // your lang attribute
  eleventyConfig.addGlobalData("rootTitle", "Apoxicam");
  eleventyConfig.addGlobalData("rootURL", "https://twcarty.netlify.app");
  eleventyConfig.addGlobalData(
    "quotes",
    "<i>No one comes to your website to be entertained. They have questions they think you can answer. Content answers questions.</i><br /><b>― Jay Baer</b>"
  );
  eleventyConfig.addGlobalData("SUPABASE_URL", process.env.SUPABASE_URL);
  eleventyConfig.addGlobalData("SUPABASE_KEY", process.env.SUPABASE_KEY);

  // Bypass dir
  const passthroughCopies = ["src/robots.txt", "src/asset/", "src/CNAME"];
  passthroughCopies.forEach((path) => eleventyConfig.addPassthroughCopy(path));

  // Custom collection
  const collectionConfigs = [
    { name: "posts", glob: "src/blog/**/*.md" },
    { name: "photos", glob: "src/photos/**/*.md" },
    { name: "recentPosts", glob: "src/blog/*.md", limit: 3 },
    { name: "recentPhotos", glob: "src/photos/*.md", limit: 6 },
  ];

  // Loop custom collection
  collectionConfigs.forEach((config) => {
    eleventyConfig.addCollection(config.name, function (collectionApi) {
      let items = collectionApi.getFilteredByGlob(config.glob);
      return config.limit ? items.reverse().slice(0, config.limit) : items;
    });
  });

  // Filter to get first image array cover
  eleventyConfig.addFilter("firstCoverImage", function (cover) {
    if (Array.isArray(cover) && cover.length > 0) {
      return cover[0].url;
    }
    return cover;
  });

  // Tags collection for blog and photos
  ["blog", "photos"].forEach((type) => {
    eleventyConfig.addCollection(`${type}Tags`, getTags(type));
  });

  // Filter to limit words string
  eleventyConfig.addLiquidFilter("limitWords", function (str, wordLimit) {
    let words = str.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return str;
  });

  /**
   * Get tag from collection
   * @param {'blog'|'photos'} type - Collection type (blog or photos)
   * @returns {Array} - Array uniq tags
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

  eleventyConfig.on("eleventy.before", async () => {
    const tailwindInputPath = path.resolve("./src/styles.css");
    const tailwindOutputPath = "./_site/asset/css/style.css";
    const cssContent = fs.readFileSync(tailwindInputPath, "utf8");
    const outputDir = path.dirname(tailwindOutputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await postcss([tailwindcss()]).process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
