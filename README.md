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
```

You can run this example using [beefy](https://github.com/chrisdickinson/beefy):

```
git clone https://github.com/DamonOehlman/spritey.git
cd spritey
npm install
beefy --cwd examples/ loader.js
```

### activate()

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
