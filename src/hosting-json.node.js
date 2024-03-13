"use strict";

import fs from "fs";
import zlib from "zlib";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const gunzip = promisify(zlib.gunzip);

/**
 * Converts a readable stream to a string.
 * @param {ReadableStream} stream - The readable stream to convert.
 * @returns {Promise<string>} A promise that resolves to the string representation of the stream.
 */
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("error", reject);
    stream.on("data", (chunk) => chunks.push(chunk));
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
  const text = await streamToString(readStream);
  const unzipped = await gunzip(text);
  return unzipped.toString();
}

/**
 * Loads JSON data from a file path.
 * @param {string} jsonPath - The path to the JSON file.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON object.
 */
async function loadJSON(jsonPath) {
  const jsonBuffer = jsonPath.endsWith(".gz")
    ? await getGzippedFileAsJson(jsonPath)
    : await readFile(jsonPath);
  return JSON.parse(jsonBuffer);
}

module.exports = {
  loadJSON,
};
