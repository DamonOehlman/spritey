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

  You can run this example using [beefy](https://github.com/chrisdickinson/beefy):

  ```
  git clone https://github.com/DamonOehlman/spritey.git
  cd spritey
  npm install
  beefy examples/loader.js
  ```

  ## Understanding Scaling and Offsets, etc

  It's important to understand that BrowserQuest sprites are designed to be
  used within a tiling 2d map engine, and thus have been designed to work with
  various tile sizes.  As outlined in the BrowserQuest wiki, generally three
  versions of the sprites have been created:

  - client/img/1: smallest sprites, meant for a map with 16x16 pixels tiles;
  - client/img/2: medium sprites, meant for a map with 32x32 pixels tiles;
  - client/img/3: bigest sprites, meant for a map with 48x48 pixels tiles

  The loader example above demonstrates loading images for the `2` series images
  which are designed to align against 32x32 map tiles.

  ## Reference (To be completed)
**/

exports.loader = require('./loader');
exports.Sprite = require('./sprite');