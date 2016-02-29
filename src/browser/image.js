'use strict';

const dataURLToArrayBuffer = dataURL => {
  const string = atob(dataURL.replace(/.+,/, ''));
  const view = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    view[i] = string.charCodeAt(i);
  }
  return view.buffer;
};

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
    return new Promise(resolve => {
      const data = image.data;
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(image.width, image.height);
      const dataData = imageData.data;
      for (let i = 0; i < dataData.length; i++) {
        dataData[i] = data[i];
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(dataURLToArrayBuffer(canvas.toDataURL(mime || 'image/png')));
    });
  },
  /**
   * Create imageData.data from image
   * @access private
   * @param {ArrayBuffer} buffer image buffer
   * @returns {imageData} imageData
   */
  decode (buffer) {
    return new Promise(resolve => {
      const url = global.URL.createObjectURL(new global.Blob([buffer]));
      const img = global.document.createElement('img');
      img.src = url;
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const canvas = global.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, width, height));
      };
    });
  }
};

module.exports = Image;
