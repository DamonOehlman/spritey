# spritey

Spritey is a sprite loader and associated tools for loading
[BrowserQuest](https://github.com/browserquest/BrowserQuest) compatible
[sprites](https://github.com/browserquest/BrowserQuest/wiki/How-to-create-a-sprite)
in your browser (using a browserify friendly module).


[![NPM](https://nodei.co/npm/spritey.png)](https://nodei.co/npm/spritey/)


## Example Usage

```js
var loader = require('spritey/loader');
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
```

You can run this example using [beefy](https://github.com/chrisdickinson/beefy):

```
git clone https://github.com/DamonOehlman/spritey.git
cd spritey
npm install
beefy examples/loader.js
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
