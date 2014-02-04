var loader = require('../loader');
var crel = require('crel');
var trap = require('mousetrap');
var sprites = [
  require('../sprite/firefox.json'),
  require('../sprite/goblin.json'),
  require('../sprite/deathknight.json')
].map(loader('sprite/2', { scale: 2 }));

var objects = [];
var canvas = crel('canvas', { width: 500, height: 500 });
var context = canvas.getContext('2d');
var shell = require('game-shell')();

function spawn() {
  objects.push({
    sprite: sprites[(Math.random() * sprites.length) | 0],
    x: 48,
    y: 48
  });
}

shell.bind('spawn', 'space');
shell.bind('move-left', 'left', 'A')
shell.bind('move-right', 'right', 'D')
shell.bind('move-up', 'up', 'W')
shell.bind('move-down', 'down', 'S')

shell.on('init', function() {
  console.log('initialized');

  shell.element.appendChild(canvas);

});

shell.on('tick', function() {
  objects.forEach(function(obj) {
    obj.sprite.draw(context, obj.x, obj.y);
  });

  if (shell.wasDown('spawn')) {
    spawn();
  }
});

spawn();