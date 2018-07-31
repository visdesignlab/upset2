const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let nodeModules = {};
fs.readdirSync('node_modules').filter(function (x) {
    return ['bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server/server.ts',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  mode: 'development',
  output: {
    path: path.join(__dirname),
    filename: 'server.js'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".html"],
    modules: ["src", "node_modules"]
  },
  externals: nodeModules,
  watch: true
}