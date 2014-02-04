var loader = require('../loader');
var trap = require('mousetrap');
var sprites = [
  require('./assets/firefox.json'),
  require('./assets/goblin.json'),
  require('./assets/deathknight.json')
].map(loader('assets/2', { scale: 2 }));
var currentSprite;
var currentIndex = 0;

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

  document.body.appendChild(sprite.element);
  currentSprite = sprite;
}

// activate the first sprite
activateSprite(sprites[currentIndex]);

// toggle between the sprites every 1s
setInterval(function() {
  currentIndex = (currentIndex + 1) % sprites.length;
  activateSprite(sprites[currentIndex]);
}, 1000);