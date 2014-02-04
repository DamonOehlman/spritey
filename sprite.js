/* jshint node: true */
'use strict';

var extend = require('cog/extend');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var transform = require('feature/css')('transform');

var directions = [
  'left',
  'right',
  'up',
  'down'
];

/**
  ### Sprite

  ```js
  var Sprite = require('spritey/Sprite');
  ```

**/
function Sprite(data, img) {
  if (! (this instanceof Sprite)) {
    return new Sprite(data, img);
  }

  EventEmitter.call(this);

  // initilaise the sprite id and then check the id
  this.id = (data || {}).id;

  if (! this.id) {
    throw new Error('A sprite must be initialized with an id');
  }

  // initialise the width and height
  this.width = data.width;
  this.height = data.height;

  // initialise the image
  this.loaded = false;
  this.image = data.image || new Image();

  // initialise the current animation name and frame index
  this.animation = null;
  this.frameIndex = 0;
  this.fps = data.fps || 12;
  this.frameDelay = (1000 / this.fps) | 0;
  this.nextTick = 0;

  // initialise the scale
  this.scale = (data.scale || 1);

  // create a canvas for the new sprite
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width * this.scale;
  this.canvas.height = this.height * this.scale;
  this.context = this.canvas.getContext('2d');

  // if a url has been specified (but no source image), then load the image
  if (data.url && (! data.image)) {
    this.image.src = data.url;
  }

  // clone the animations from the source
  this.animations = extend({}, data.animations);

  // initialise the offset x and offset y
  this.offset = extend({}, data.offset || {
    x: data.offset_x * this.scale,
    y: data.offset_y * this.scale
  });

  this.once('load', this._loadFrames.bind(this));
  this._checkLoaded();

  // if we have been told not to transform then do nothing more
  if (! data.transform) {
    return;
  }

  this._applyOffsets();
}

util.inherits(Sprite, EventEmitter);
module.exports = Sprite;

var prot = Sprite.prototype;

/**
  #### element attribute

  The element attribute when accessed, will create a simple div HTML element
  that can be added to the DOM and contains the sprite canvas with the
  appropriate sprite offsets applied.

  This element can be then transformed in it's own right without impacting
  the normalization offset of the sprite itself.
**/  
Object.defineProperty(prot, 'element', {
  get: function() {
    if (! this._element) {
      this._element = document.createElement('div');
      this._element.style.width = (16 * this.scale) + 'px';
      this._element.style.height = (16 * this.scale) + 'px';
      this._element.appendChild(this.canvas);
    }

    return this._element;
  }
})

/**
  #### activate()

**/
prot.activate = function(animation, label, flipH, flipV) {
  var animData = this.animations[animation];
  var ctx = this.context;
  var scaleH = flipH ? -1 : 1;
  var scaleV = flipV ? -1 : 1;
  var tick = Date.now();

  // if we don't have animation data throw an exception
  if (! animData) {
    throw new Error('No animation "' + animation + '" available in the sprite');
  }

  if (this.animation !== label) {
    this.animation = label;
    this.frameIndex = 0;
  }
  // if we are cycling and have been called too early, then wait
  else if (tick < this.nextTick) {
    return;
  }
  else {
    this.frameIndex += 1;
  }

  // ensure the frame index is within range
  this.frameIndex = this.frameIndex % animData.length;

  // if we are not loaded, just return
  if (! this.loaded) {
    return;
  }

  // draw the frame to the canvas
  ctx.save();
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.scale(scaleH, scaleV);
  ctx.drawImage(
    this.image,
    this.frameIndex * this.width * this.scale,
    animData.row * this.height * this.scale,
    this.width * this.scale,
    this.height * this.scale,
    flipH ? -this.width * this.scale : 0,
    flipV ? -this.height * this.scale : 0,
    this.canvas.width,
    this.canvas.height
  );
  ctx.restore();

  // calculate the next tick
  this.nextTick = tick + this.frameDelay;
};

prot.draw = function(target, x, y) {
  target.drawImage(this.canvas, x + this.offset.x, y + this.offset.y);
};

prot._applyOffsets = function() {
  var x = this.offset.x * this.scale;
  var y = this.offset.y * this.scale;

  // if we don't have transforms abort
  if (typeof transform != 'function') {
    return;
  }

  // apply the offset transform
  transform(this.canvas, 'translate(' + this.offset.x + 'px,' + this.offset.y + 'px)');
};

prot._checkLoaded = function() {
  var oldLoaded = this.loaded;

  // check the new loaded state
  this.loaded = this.image.width > 0 || this.image.height > 0;

  // if not loaded, then monitor the onload event
  if (! this.loaded) {
    this.image.onload = this.image.onload || this._checkLoaded.bind(this);
  }
  // otherwise, if the oldLoaded flag as false, then the image has just
  // loaded and we can now do stuff with the image
  else if (! oldLoaded) {
    this.emit('load');
  }
};

prot._loadFrames = function() {
  var animTypes = Object.keys(this.animations);
  var actionDirections = animTypes.map(function(animation) {
    return animation.split('_')[1];
  });
  var sprite = this;
  var activate = prot.activate;

  // add a method to the instance
  animTypes.forEach(function(animation, idx) {
    // get the action prefix
    var action = animation.split('_')[0];
    var dir = actionDirections[idx];
    var inverted = dir && (action + '_' + directions[directions.indexOf(dir) ^ 1]);

    // initilaise the listed animation method
    sprite[animation] = activate.bind(sprite, animation, animation, false, false);

    // if we need to generate the inverted action
    // i.e. it isn't explicitly defined do that now
    if (animTypes.indexOf(inverted) < 0) {
      sprite[inverted] = activate.bind(
        sprite,
        animation,
        inverted,
        dir === 'left' || dir === 'right',
        dir === 'up' || dir === 'down'
      );
    }
  });

  // run the first animation to initialize
  if (animTypes.length > 0) {
    this[this.animation || animTypes[0]].call(this);
  }
};