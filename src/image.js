'use strict';

const Jimp = require('jimp');

const bufferToArrayBuffer = require('./utils/buffer-to-arraybuffer');

/**
 * @access private
 * @typedef imageData
 * @type Object
 * @property {Number} width image width
 * @property {Numbrt} height image height
 * @property {Uint8ClampedArray} data same
 */

const Image = {
  /**
   * Create image from imageData.data
   * @access private
   * @param {imageData} image imageData
   * @param {String} mime Mime type
   * @returns {ArrayBuffer} encoded image
   */
  encode (image, mime) {
    const data = image.data;
    const jimp = new Jimp(image.width, image.height);
    jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, function scan (x, y, idx) {
      this.bitmap.data[idx + 0] = data[idx + 0]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 1] = data[idx + 1]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 2] = data[idx + 2]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 3] = data[idx + 3]; // eslint-disable-line no-invalid-this
    });
    return new Promise((resolve, reject) => {
      jimp.getBuffer(mime || Jimp.MIME_PNG, (err, buffer) => {
        /* istanbul ignore if */
        if (err) {
          reject(err);
        } else {
          resolve(bufferToArrayBuffer(buffer));
        }
      });
    });
  },
  /**
   * Create imageData.data from image
   * @access private
   * @param {ArrayBuffer} buffer image buffer
   * @returns {imageData} imageData
   */
  decode (buffer) {
    return Jimp.read(new Buffer(buffer)).then(image => ({
      width: image.bitmap.width,
      height: image.bitmap.height,
      data: new Uint8ClampedArray(image.bitmap.data)
    }));
  }
};

module.exports = Image;
