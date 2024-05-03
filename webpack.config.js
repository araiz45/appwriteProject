const nodeExternals = require("webpack-node-externals");

module.exports = {
  // other configuration options...
  target: "node", // This is important to compile node compatible code
  externals: [nodeExternals()], // Omit node_modules from bundle
};
