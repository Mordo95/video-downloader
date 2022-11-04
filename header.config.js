const { defineTmHeader } = require('vite-plugin-tm-userscript');

module.exports = defineTmHeader({
  name: 'Video Downloader for Tampermonkey',
  namespace: 'com.mordo95.Downloader',
  version: '0.5',
  author: 'Mordo95',
  description: 'Will add a download button to Reddit, Facebook and Youtube videos',
  //homepage: 'https://greasyfork.org/scripts/******',
  license: 'MIT',
  match: [
    '*://*/*',
  ],
  supportURL: 'https://github.com',
  'run-at': 'document-start'
});