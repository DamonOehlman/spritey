/* jshint node: true */
'use strict';

var extend = require('cog/extend');

function Sprite(data, img) {
  if (! (this instanceof Sprite)) {
    return new Sprite(data, img);
  }

  // initilaise the sprite id and then check the id
  this.id = (data || {}).id;

  if (! this.id) {
    throw new Error('A sprite must be initialized with an id');
  }

  // initialise the width and height
  this.width = data.width;
  this.height = data.height;

  // initialise the image
  this.image = data.image || new Image();

  // if a url has been specified (but no source image), then load the image
  if (data.url && (! data.image)) {
    this.image.src = data.url;
  }

  // clone the animations from the source
  this.animations = extend({}, data.animations);

  // initialise the offset x and offset y
  this.offset = data.offset || {
    x: data.offset_x,
    y: data.offset_y
  };
}

module.exports = Sprite;