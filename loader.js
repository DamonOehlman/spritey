/* jshint node: true */
'use strict';

var extend = require('cog/extend');
var reTrailingSlash = /\/$/;
var Sprite = require('./sprite');

/**
  ### loader

  ```js
  var loader = require('spritey/loader');
  ```
**/

module.exports = function(basePath, spriteData) {
  var baseData = {};

  // strip any trailing slashes
  basePath = basePath.replace(reTrailingSlash, '');

  // if we have been provided sprite data but no idea, then this
  // is just base data (i.e. scaling information, etc)
  if (spriteData && (! spriteData.id)) {
    extend(baseData, spriteData);
  }

  function load(data) {
    var id = (data || {}).id;

    // if we don't have an id, then raise an exception
    if (! id) {
      throw new Exception('sprite data must contain an id to load');
    }

    // create the sprite instance
    return new Sprite(extend({
      url: basePath + '/' + id + '.png'
    }, baseData, data));
  }

  return spriteData && spriteData.id ? load(spriteData) : load;
}