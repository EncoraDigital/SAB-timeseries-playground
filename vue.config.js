const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://daitan-group.gitlab.io/innovation/poc/timeseries-learning-tool/'
    : '/',

  configureWebpack: (config) => {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the `compress` and `output`
              ecma: 8,
            },
            compress: {
              ecma: 5,
              inline: 2,
            },
            mangle: {
              // Find work around for Safari 10+
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
            },
            // Use multi-process parallel running to improve the build speed
            parallel: true,
            // Enable file caching
            cache: true,

          },
        }),
      ],
    };

    config.module.rules = [
      {
        test: /\.worker\.js$/i,
        use: [
          {
            loader: 'worker-loader',
          },
        ],
      },
      ...config.module.rules,
    ];
  },
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/',
        '',
      ],
      useRenderEvent: false,
      headless: true,
      onlyProduction: true,
    },
  },
};
