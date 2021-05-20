module.exports = {
  presets: [
    '@vue/app',
    '@babel/preset-env',
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
  ],
};
