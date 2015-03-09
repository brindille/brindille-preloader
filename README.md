# brindille-preloader

Promise or event based preloader using [PxLoader](https://github.com/thinkpixellab/PxLoader)

## Install
With [npm](http://npmjs.org) do:

```bash
$ npm install brindille-preloader --save
```

## Usage

```js
var preloader = require('brindille-preloader');
```

### Event based usage

```js
preloader.on('progress', progressHandler);
preloader.on('complete', completeHandler);
preloader.on('error', errorHandler);
preloader.load([
    { id: 'img1', src: 'images/1.jpg', priority: 0, origin: 'anonymous' },
    { id: 'img2', src: 'images/2.jpg', priority: 0, origin: 'anonymous' },
    { id: 'vidTest', src: 'videos/vid.mp4', priority: 0, origin: 'anonymous' },
    { id: 'soundTest', src: 'sounds/sound.mp3', priority: 0, origin: 'anonymous' }
]);
```

### Promise based usage

```js
preloader.load([
    { id: 'img1', src: 'images/1.jpg', priority: 0, origin: 'anonymous' },
    { id: 'img2', src: 'images/2.jpg', priority: 0, origin: 'anonymous' },
    { id: 'vidTest', src: 'videos/vid.mp4', priority: 0, origin: 'anonymous' },
    { id: 'soundTest', src: 'sounds/sound.mp3', priority: 0, origin: 'anonymous' }
]);
preloader.getPromise()
    .then(completeHandler)
    .fail(errorHandler);
```

### Get loaded ressource

```js
var myImage = preloader.getImage('img1');
var myVideo = preloader.getVideo('vidTest');
var mySound = preloader.getSound('soundTest');
```

## License

MIT