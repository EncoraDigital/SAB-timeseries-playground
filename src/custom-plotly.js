/* eslint-disable global-require */
const Plotly = require('plotly.js/lib/core');

Plotly.register([
  require('plotly.js/lib/histogram'),
  require('plotly.js/lib/scatter'),
]);

module.exports = Plotly;
