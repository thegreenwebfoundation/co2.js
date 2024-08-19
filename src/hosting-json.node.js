"use strict";

import fs from "fs";
import zlib from "zlib";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const gunzip = promisify(zlib.gunzip);

/**
 * Converts a readable stream to a string.
 * @param {fs.ReadStream} stream - The readable stream to convert.
 * @returns {Promise<Buffer>} A promise that resolves to the string representation of the stream.
 */
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    stream.on("error", reject);
    stream.on("data", (chunk) =>
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Get the contents of a gzipped file as a JSON string.
 * @param {string} jsonPath - The path to the gzipped JSON file.
 * @returns {Promise<string>} A promise that resolves to the JSON string.
 */
async function getGzippedFileAsJson(jsonPath) {
  const readStream = fs.createReadStream(jsonPath);
  const text = await streamToBuffer(readStream);
  const unzipped = await gunzip(text);
  return unzipped.toString();
}

/**
 * Loads JSON data from a file path.
 * @param {string} jsonPath - The path to the JSON file.
 * @returns {Promise<string[]>} A promise that resolves to the parsed JSON object.
 */
async function loadJSON(jsonPath) {
  const jsonBuffer = jsonPath.endsWith(".gz")
    ? await getGzippedFileAsJson(jsonPath)
    : await readFile(jsonPath);
  // TODO (simon) should we check that the parsed JSON is a list of strings?
  return JSON.parse(jsonBuffer.toString());
}

export default {
  loadJSON,
};
