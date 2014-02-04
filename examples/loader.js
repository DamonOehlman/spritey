var loader = require('../loader');
var trap = require('mousetrap');
var sprites = [
  require('./assets/firefox.json'),
  require('./assets/goblin.json')
].map(loader('assets'));

document.body.appendChild(sprites[0].canvas);

trap.bind('right', function() {
  sprites[0].walk_right();
});