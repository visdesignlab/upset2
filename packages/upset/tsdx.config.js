const postcss = require('rollup-plugin-postcss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        inject: false,
        extract: !!options.writeMeta,
      }),
    );
    return config;
  },
};
