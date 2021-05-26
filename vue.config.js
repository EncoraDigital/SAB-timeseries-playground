const WorkerPlugin = require('worker-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/timeseries-playground/'
    : '/',

  chainWebpack: (config) => {
    config
      .optimization
      .usedExports(true)
      .end()
      .plugin('worker-plugin')
      .use(WorkerPlugin)
      .end()
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Timeseries Playground';
        return args;
      })
      .end()
      .module
      .rule('compile')
      .test(/\.js$/)
      .exclude
      .add(/node_modules/)
      .add('/model/unit_tests/')
      .add(/\.test.js$/)
      .add(/\.tests.js$/)
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({ presets: ['@babel/preset-env'] })
      .end();
  },
};
