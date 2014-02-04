var loader = require('../loader');
var trap = require('mousetrap');
var sprites = [
  require('../sprite/firefox.json'),
  require('../sprite/goblin.json'),
  require('../sprite/deathknight.json')
].map(loader('sprite/2', { scale: 2 }));
var currentSprite;
var currentIndex = 0;

function activateNext() {
  currentIndex = (currentIndex + 1) % sprites.length;
  activateSprite(sprites[currentIndex]);
}

function activateSprite(sprite) {
  if (currentSprite) {
    document.body.removeChild(currentSprite.element);
  }

  if (! sprite.loaded) {
    return sprite.once('load', activateSprite.bind(null, sprite));
  }

  trap.reset();
  trap.bind('right', sprite.walk_right);
  trap.bind('left', sprite.walk_left);
  trap.bind('up', sprite.walk_up);
  trap.bind('down', sprite.walk_down);
  trap.bind('space', activateNext);

  document.body.appendChild(sprite.element);
  currentSprite = sprite;
}

// activate the first sprite
activateSprite(sprites[currentIndex]);