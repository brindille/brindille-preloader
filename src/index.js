import PxLoader from 'pxloader';
import 'pxloader/PxLoaderImage';
import 'pxloader/PxLoaderVideo';
import 'pxloader/PxLoaderSound';
import Emitter from 'emitter-component';
import Q from 'q';

// regexp to know which kind of file is in manifest
const IMAGE_PATTERN = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif|svg))/gi;
const VIDEO_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp4|mov|webm|ogv))/gi;
const SOUND_PATTERN = /([a-z\-_0-9\/\:\.]*\.(mp3|wav))/gi;

class Preloader extends Emitter {
  constructor() {
    super();
    this._loader = new PxLoader();
    this._deferred = Q.defer();
    this.imagesContent = [];
    this.soundsContent = [];
    this.videosContent = [];
  }

  /**
   * Load manifest using PxLoader
   * @param  {array} manifest array of object added to manifest
   *                          following this structure:
   *                          {id: 'someId', src: 'myUrl', priority: 0, origin:  'anonymous'}
   */
  load(manifest) {
    this._loader.addCompletionListener(this._handleComplete.bind(this));
    this._loader.addProgressListener(this._handleProgress.bind(this));

    for (let i = 0, l = manifest.length; i < l; i++) {
      if (manifest[i].src.match(IMAGE_PATTERN)) { this.addImage(manifest[i]); }
      if (manifest[i].src.match(SOUND_PATTERN)) { this.addSound(manifest[i]); }
      if (manifest[i].src.match(VIDEO_PATTERN)) { this.addVideo(manifest[i]); }
    }

    this._loader.start();
    return this;
  }

  /**
   * Return promise for projects based on it
   * @return {Promise}
   */
  getPromise() {
    return this._deferred.promise;
  }

  /**
   * Add image to preload
   * @param {Object} infos object following manifest object structure (see above)
   */
  addImage(infos) {
    this.imagesContent[infos.id] = this._loader.addImage(infos.src, infos.id, infos.priority, infos.origin);
  }

  /**
   * Find image desired
   * @param  {String} id image name
   * @return {Image}
   */
  getImage(id) {
    return this.imagesContent[id];
  }

  /**
   * Add sound to preload
   * @param {Object} infos object following manifest object structure (see above)
   */
  addSound(infos) {
    this.soundsContent[infos.id] = this._loader.addSound(infos.id, infos.src, null, infos.priority);
  }

  /**
   * Find sound desired
   * @param  {String} id sound name
   * @return {Image}
   */
  getSound(id) {
    return this.soundsContent[id];
  }

  /**
   * Add video to preload
   * @param {Object} infos object following manifest object structure (see above)
   */
  addVideo(infos) {
    this.videosContent[infos.id] = this._loader.addVideo(infos.src, infos.id, infos.priority, infos.origin);
  }

  /**
   * Find video desired
   * @param  {String} id video name
   * @return {Image}
   */
  getVideo(id) {
    return this.videosContent[id];
  }

  /**
   * Handle preload progression
   * @param  {Object} e
   */
  _handleProgress(e) {
    if (e.error || e.timeout) {
      return this._handleError(e);
    }

    this.emit('progress', e);
  }

  /**
   * Handle preload errors and reject promise
   * @param  {Object} e
   */
  _handleError(e) {
    this._deferred.reject();
    this.emit('error', e);
  }

  /**
   * Handle preload complete and resolve promise
   * @param  {Object} e
   */
  _handleComplete(e) {
    let res = [];

    for (let i in this.imagesContent) {
      res[i] = this.imagesContent[i];
    }

    for (let j in this.soundsContent) {
      res[j] = this.soundsContent[j];
    }

    for (let k in this.videosContent) {
      res[k] = this.videosContent[k];
    }

    this._deferred.resolve(res);
    this.emit('complete', res);
  }
}

export default new Preloader();
