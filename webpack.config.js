const path = require("path");

const conf = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

};

module.exports = (env, options) => {
  let production = options.mode === 'production';
  conf.devtool = production ? 'source-map' : 'eval-source-map';
  return conf;
};
