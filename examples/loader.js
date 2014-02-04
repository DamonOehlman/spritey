var loader = require('../loader');
var trap = require('mousetrap');
var sprites = [
  require('./assets/firefox.json'),
  require('./assets/goblin.json')
].map(loader('assets'));
var currentSprite;
var currentIndex = 0;

function activateSprite(sprite) {
  if (currentSprite) {
    document.body.removeChild(currentSprite.canvas);
  }

  if (! sprite.loaded) {
    return sprite.once('load', activateSprite.bind(null, sprite));
  }

  trap.reset();
  trap.bind('right', sprite.walk_right);
  trap.bind('left', sprite.walk_left);
  trap.bind('up', sprite.walk_up);
  trap.bind('down', sprite.walk_down);

  document.body.appendChild(sprite.canvas);
  currentSprite = sprite;
}

activateSprite(sprites[currentIndex]);

setInterval(function() {
  activateSprite(sprites[currentIndex ^= 1]);
}, 1000);