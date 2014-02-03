/* jshint node: true */
'use strict';

var extend = require('cog/extend');
var reTrailingSlash = /\/$/;
var Sprite = require('./sprite');

module.exports = function(basePath, spriteData) {
  // strip any trailing slashes
  basePath = basePath.replace(reTrailingSlash, '');

  function load(data) {
    var id = (data || {}).id;

    // if we don't have an id, then raise an exception
    if (! id) {
      throw new Exception('sprite data must contain an id to load');
    }

    // create the sprite instance
    return new Sprite(extend({
      url: basePath + '/' + id + '.png'
    }, data));
  }

  return name ? load(spriteData) : load;
}