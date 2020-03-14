"use strict";

const log = require("debug")("tgwf:hostingCache");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

async function check(domain, jsonPath) {
  // TODO we want to memoise this to avoid
  // repeatedly loading it
  const jsonBuffer = await readFile(jsonPath);
  const db = JSON.parse(jsonBuffer);

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
  let greenEntries = entries.filter(function([key, val]) {
    return val.green;
  });

  return greenEntries.map(function([key, val]) {
    return val.url;
  });
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
  check
};
