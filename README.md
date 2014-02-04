# spritey

Spritey is a sprite loader and associated tools for loading
[BrowserQuest](https://github.com/browserquest/BrowserQuest) compatible
[sprites](https://github.com/browserquest/BrowserQuest/wiki/How-to-create-a-sprite)
in your browser (using a browserify friendly module).


[![NPM](https://nodei.co/npm/spritey.png)](https://nodei.co/npm/spritey/)


## Example Usage

```js
var loader = require('spritey/loader');
var crel = require('crel');
var Sprite = require('spritey/sprite');
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
```

You can run this example using [beefy](https://github.com/chrisdickinson/beefy):

```
git clone https://github.com/DamonOehlman/spritey.git
cd spritey
npm install
beefy examples/loader-canvas.js
```

## Understanding Scaling and Offsets, etc

It's important to understand that BrowserQuest sprites are designed to be
used within a tiling 2d map engine, and thus have been designed to work with
various tile sizes.  As outlined in the BrowserQuest wiki, generally three
versions of the sprites have been created:

- client/img/1: smallest sprites, meant for a map with 16x16 pixels tiles;
- client/img/2: medium sprites, meant for a map with 32x32 pixels tiles;
- client/img/3: bigest sprites, meant for a map with 48x48 pixels tiles

The loader example above demonstrates loading images for the `2` series images
which are designed to align against 32x32 map tiles.

## Reference (To be completed)

### loader

```js
var loader = require('spritey/loader');
```

### Sprite

```js
var Sprite = require('spritey/Sprite');
```

#### element attribute

The element attribute when accessed, will create a simple div HTML element
that can be added to the DOM and contains the sprite canvas with the
appropriate sprite offsets applied.

This element can be then transformed in it's own right without impacting
the normalization offset of the sprite itself.

#### activate()

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
