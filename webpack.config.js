const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/main.ts",
  mode: "production",
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/js")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      d3: "d3",
      $: "jquery",
      "window.$": "jquery"
    })
  ],
  watch: true
};
