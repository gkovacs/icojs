'use strict';

const isICO = require('./is-ico');
const parseBMP = require('./parse-bmp');
const range = require('./utils/range');

/**
 * Parse ICO and return some PNGs.
 * @memberof ICO
 * @param {ArrayBuffer} arrayBuffer The ArrayBuffer object contain the TypedArray of a ICO file.
 * @returns {Promise<Object[]>} Resolves to array of parsed ICO.
 *   * `width` **Number** - Image width.
 *   * `height` **Number** - Image height.
 *   * `bit` **Number** - Image bit depth.
 *   * `data` **Uint8ClampedArray** - imageData.data.
 */
const parseICO = arrayBuffer => {
  if (!isICO(arrayBuffer)) {
    throw new Error('buffer is not ico');
  }
  const dataView = new DataView(arrayBuffer);

  const count = dataView.getUint16(4, true);
  const infoHeaders = range(count)
    .map(index => {
      const length = 16;
      const offset = 6 + (index * length);
      return arrayBuffer.slice(offset, offset + length);
    });
  const bitmaps = range(count)
    .map(index => {
      const infoHeader = new DataView(infoHeaders[index]);
      const length = infoHeader.getUint32(8, true);
      const offset = infoHeader.getUint32(12, true);
      return arrayBuffer.slice(offset, offset + length);
    });
  const icos = range(count)
    .map(index => {
      const infoHeader = new DataView(infoHeaders[index]);
      const width = infoHeader.getUint8(0) || 256;
      const height = infoHeader.getUint8(1) || 256;
      return parseBMP(width, height, bitmaps[index]);
    });
  return icos;
};

module.exports = parseICO;
