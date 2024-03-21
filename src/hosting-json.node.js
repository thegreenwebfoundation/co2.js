"use strict";

import fs from "fs";
import zlib from "zlib";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const gunzip = promisify(zlib.gunzip);

/**
 * Converts a readable stream to a string.
 * @param {fs.ReadStream} stream - The readable stream to convert.
 * @returns {Promise<string>} A promise that resolves to the string representation of the stream.
 */
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    stream.on("error", reject);
    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks).toString()));
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
 * @returns {Promise<string[]>} A promise that resolves to the parsed JSON object.
 */
async function loadJSON(jsonPath) {
  const jsonBuffer = jsonPath.endsWith(".gz")
    ? await getGzippedFileAsJson(jsonPath)
    : await readFile(jsonPath);
  return JSON.parse(jsonBuffer.toString());
}

/**
 * Check if a string or array of domains has been provided
 * @param {string|string[]} domain - The domain to check, or an array of domains to be checked.
 * @param {string[]} db - The domain to check, or an array of domains to be checked.
 */
async function check(domain, db) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkInJSON(domain, db);
  } else {
    return checkDomainsInJSON(domain, db);
  }
}

/**
 * Check if a domain is hosted by a green web host by querying the database.
 * @param {string} domain - The domain to check.
 * @param {string[]} db - The database to check against.
 * @returns {boolean} - A boolean indicating whether the domain is hosted by a green web host.
 */
function checkInJSON(domain, db) {
  if (db.indexOf(domain) > -1) {
    return true;
  }
  return false;
}

/**
 * Extract the green domains from the results of a green check.
 * @param {Record<string, { green: boolean, url: string}>} greenResults - The results of a green check.
 * @returns {string[]} - An array of domains that are hosted by a green web host.
 */
function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);

  return greenEntries.map(([key, val]) => val.url);
}

/**
 * Check if an array of domains is hosted by a green web host by querying the database.
 * @param {string[]} domains - An array of domains to check.
 * @param {string[]} db - The database to check against.
 * @returns {string[]} - An array of domains that are hosted by a green web host.
 */
function checkDomainsInJSON(domains, db) {
  let greenDomains = [];

  for (let domain of domains) {
    if (db.indexOf(domain) > -1) {
      greenDomains.push(domain);
    }
  }
  return greenDomains;
}

export default {
  check,
  loadJSON,
};
