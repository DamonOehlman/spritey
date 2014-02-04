/* jshint node: true */
'use strict';

var extend = require('cog/extend');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var directions = [
  'left',
  'right',
  'up',
  'down'
];

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

  // create a canvas for the new sprite
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width * (data.scale || 1);
  this.canvas.height = this.height * (data.scale || 1);
  this.context = this.canvas.getContext('2d');

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

  this.once('load', this._loadFrames.bind(this));
  this._checkLoaded();
}

util.inherits(Sprite, EventEmitter);
module.exports = Sprite;

var prot = Sprite.prototype;

/**
  ### activate()

**/
prot.activate = function(animation, flipH, flipV) {
  var animData = this.animations[animation];
  var ctx = this.context;
  var scaleH = flipH ? -1 : 1;
  var scaleV = flipV ? -1 : 1;

  // if we don't have animation data throw an exception
  if (! animData) {
    throw new Error('No animation "' + animation + '" available in the sprite');
  }

  // if we are not loaded, just return
  if (! this.loaded) {
    return;
  }

  if (this.animation !== animation) {
    this.animation = animation;
    this.frameIndex = 0;
  }
  else {
    this.frameIndex += 1;
  }

  // ensure the frame index is within range
  this.frameIndex = this.frameIndex % animData.length;

  // draw the frame to the canvas
  ctx.save();
  ctx.clearRect(0, 0, this.width, this.height);
  ctx.scale(scaleH, scaleV);
  ctx.drawImage(
    this.image,
    this.frameIndex * this.width,
    animData.row * this.height,
    this.width,
    this.height,
    flipH ? -this.width : 0,
    flipV ? -this.height : 0,
    this.width,
    this.height
  );
  ctx.restore();
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
    sprite[animation] = activate.bind(sprite, animation, false, false);

    // if we need to generate the inverted action
    // i.e. it isn't explicitly defined do that now
    if (animTypes.indexOf(inverted) < 0) {
      sprite[inverted] = activate.bind(
        sprite,
        animation,
        dir === 'left' || dir === 'right',
        dir === 'up' || dir === 'down'
      );
    }
  });
};