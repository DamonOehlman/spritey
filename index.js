/* jshint node: true */
'use strict';

/**

  # spritey

  Spritey is a sprite loader and associated tools for loading
  [BrowserQuest](https://github.com/browserquest/BrowserQuest) compatible
  [sprites](https://github.com/browserquest/BrowserQuest/wiki/How-to-create-a-sprite)
  in your browser (using a browserify friendly module).

  ## Example Usage

  <<< examples/loader.js
**/

exports.loader = require('./loader');
exports.Sprite = require('./sprite');