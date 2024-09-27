const extname = require("path").extname;

const jsmin = require("./jsmin");

module.exports = async (content, outputPath) => {
  const ext = extname(outputPath);
  switch (ext) {
    case ".js":
      return jsmin(content, outputPath);
    default:
      return content;
  }
};
