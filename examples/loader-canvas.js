var loader = require('../loader');
var crel = require('crel');
var Sprite = require('../sprite');
var sprites = [
  require('../sprite/firefox.json'),
  require('../sprite/goblin.json'),
  require('../sprite/deathknight.json'),
  require('../sprite/crab.json')
].map(loader('sprite/2', { scale: 2 }));

var objects = [];
var canvas = crel('canvas', { width: 500, height: 500 });
var context = canvas.getContext('2d');
var shell = require('game-shell')();
var spawnTimer;

function spawn() {
  clearTimeout(spawnTimer);
  spawnTimer = setTimeout(function() {
    objects.push({
      // clone the sprite so each can have different frames
      sprite: new Sprite(sprites[(Math.random() * sprites.length) | 0]),
      x: 48,
      y: 48
    });
  }, 50);
}

shell.bind('spawn', 'space');
shell.bind('walk_left', 'left', 'A')
shell.bind('walk_right', 'right', 'D')
shell.bind('walk_up', 'up', 'W')
shell.bind('walk_down', 'down', 'S')

shell.on('init', function() {
  console.log('initialized');

  shell.element.appendChild(canvas);

});

shell.on('tick', function() {
  var active = objects[objects.length - 1];

  if (shell.wasDown('spawn')) {
    spawn();
  }

  if (! active) {
    return;
  }

  // clear the canvas, inefficient, but well it's a demo
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (shell.wasDown('walk_left')) {
    active.x -=1;
    active.sprite.walk_left();
  }

  if (shell.wasDown('walk_right')) {
    active.x += 1;
    active.sprite.walk_right();
  }

  if (shell.wasDown('walk_up')) {
    active.y -= 1;
    active.sprite.walk_up();
  }

  if (shell.wasDown('walk_down')) {
    active.y += 1;
    active.sprite.walk_down();
  }

  objects.forEach(function(obj) {
    obj.sprite.draw(context, obj.x, obj.y);
  });
});

spawn();