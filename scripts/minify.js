const extname = require("path").extname;
const jsmin = require("./jsmin"); // Asumsi jsmin juga CommonJS

module.exports = async (content, outputPath) => {
  const ext = extname(outputPath);
  switch (ext) {
    case ".js":
      return jsmin(content, outputPath);
    default:
      return content;
  }
};
