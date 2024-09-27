const minify = require("terser").minify;

module.exports = async (content, outputPath) => {
  const minified = await minify(content, {});
  return minified.code;
};
