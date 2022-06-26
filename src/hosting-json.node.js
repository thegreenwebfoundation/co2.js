"use strict";

import fs from "fs";
import zlib from "zlib";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const gunzip = promisify(zlib.gunzip);

import debugFactory from "debug";
const log = debugFactory("tgwf:hostingCache");

async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("error", reject);
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

async function getGzippedFileAsJson(jsonPath) {
  const readStream = fs.createReadStream(jsonPath);
  const text = await streamToString(readStream);
  const unzipped = await gunzip(text);
  return unzipped.toString();
}

async function loadJSON(jsonPath) {
  const jsonBuffer = jsonPath.endsWith(".gz")
    ? await getGzippedFileAsJson(jsonPath)
    : await readFile(jsonPath);
  return JSON.parse(jsonBuffer);
}

async function check(domain, db) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkInJSON(domain, db);
  } else {
    return checkDomainsInJSON(domain, db);
  }
}

function checkInJSON(domain, db) {
  if (db.indexOf(domain) > -1) {
    return true;
  }
  return false;
}

function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);

  return greenEntries.map(([key, val]) => val.url);
}

function checkDomainsInJSON(domains, db) {
  let greenDomains = [];

  for (let domain of domains) {
    if (db.indexOf(domain) > -1) {
      greenDomains.push(domain);
    }
  }
  return greenDomains;
}

module.exports = {
  check,
  loadJSON,
};
