'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pxloader = require('pxloader');

var _pxloader2 = _interopRequireDefault(_pxloader);

require('pxloader/PxLoaderImage');

require('pxloader/PxLoaderVideo');

require('pxloader/PxLoaderSound');

var _emitterComponent = require('emitter-component');

var _emitterComponent2 = _interopRequireDefault(_emitterComponent);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// regexp to know which kind of file is in manifest
var IMAGE_PATTERN = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif|svg))/gi;
var VIDEO_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp4|mov|webm|ogv))/gi;
var SOUND_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp3|wav))/gi;

var Preloader = function (_Emitter) {
  _inherits(Preloader, _Emitter);

  function Preloader() {
    _classCallCheck(this, Preloader);

    var _this = _possibleConstructorReturn(this, (Preloader.__proto__ || Object.getPrototypeOf(Preloader)).call(this));

    _this._loader = new _pxloader2.default();
    _this._deferred = _q2.default.defer();
    _this.imagesContent = [];
    _this.soundsContent = [];
    _this.videosContent = [];
    return _this;
  }

  /**
   * Load manifest using PxLoader
   * @param  {array} manifest array of object added to manifest
   *                          following this structure:
   *                          {id: 'someId', src: 'myUrl', priority: 0, origin:  'anonymous'}
   */


  _createClass(Preloader, [{
    key: 'load',
    value: function load(manifest) {
      this._loader.addCompletionListener(this._handleComplete.bind(this));
      this._loader.addProgressListener(this._handleProgress.bind(this));

      for (var i = 0, l = manifest.length; i < l; i++) {
        if (manifest[i].src.match(IMAGE_PATTERN)) {
          this.addImage(manifest[i]);
        }
        if (manifest[i].src.match(SOUND_PATTERN)) {
          this.addSound(manifest[i]);
        }
        if (manifest[i].src.match(VIDEO_PATTERN)) {
          this.addVideo(manifest[i]);
        }
      }

      this._loader.start();
      return this;
    }

    /**
     * Return promise for projects based on it
     * @return {Promise}
     */

  }, {
    key: 'getPromise',
    value: function getPromise() {
      return this._deferred.promise;
    }

    /**
     * Add image to preload
     * @param {Object} infos object following manifest object structure (see above)
     */

  }, {
    key: 'addImage',
    value: function addImage(infos) {
      this.imagesContent[infos.id] = this._loader.addImage(infos.src, infos.id, infos.priority, infos.origin);
    }

    /**
     * Find image desired
     * @param  {String} id image name
     * @return {Image}
     */

  }, {
    key: 'getImage',
    value: function getImage(id) {
      return this.imagesContent[id];
    }

    /**
     * Add sound to preload
     * @param {Object} infos object following manifest object structure (see above)
     */

  }, {
    key: 'addSound',
    value: function addSound(infos) {
      this.soundsContent[infos.id] = this._loader.addSound(infos.id, infos.src, null, infos.priority);
    }

    /**
     * Find sound desired
     * @param  {String} id sound name
     * @return {Image}
     */

  }, {
    key: 'getSound',
    value: function getSound(id) {
      return this.soundsContent[id];
    }

    /**
     * Add video to preload
     * @param {Object} infos object following manifest object structure (see above)
     */

  }, {
    key: 'addVideo',
    value: function addVideo(infos) {
      this.videosContent[infos.id] = this._loader.addVideo(infos.src, infos.id, infos.priority, infos.origin);
    }

    /**
     * Find video desired
     * @param  {String} id video name
     * @return {Image}
     */

  }, {
    key: 'getVideo',
    value: function getVideo(id) {
      return this.videosContent[id];
    }

    /**
     * Handle preload progression
     * @param  {Object} e
     */

  }, {
    key: '_handleProgress',
    value: function _handleProgress(e) {
      if (e.error || e.timeout) {
        return this._handleError(e);
      }

      this.emit('progress', e);
    }

    /**
     * Handle preload errors and reject promise
     * @param  {Object} e
     */

  }, {
    key: '_handleError',
    value: function _handleError(e) {
      this._deferred.reject();
      this.emit('error', e);
    }

    /**
     * Handle preload complete and resolve promise
     * @param  {Object} e
     */

  }, {
    key: '_handleComplete',
    value: function _handleComplete(e) {
      var res = [];

      for (var i in this.imagesContent) {
        res[i] = this.imagesContent[i];
      }

      for (var j in this.soundsContent) {
        res[j] = this.soundsContent[j];
      }

      for (var k in this.videosContent) {
        res[k] = this.videosContent[k];
      }

      this._deferred.resolve(res);
      this.emit('complete', res);
    }
  }]);

  return Preloader;
}(_emitterComponent2.default);

exports.default = new Preloader();