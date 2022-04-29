"use strict";

const log = require("debug")("tgwf:hosting");

/**
 * check if we're running inside a node environment by looking for the
 * existence of a process object, with accompanying properties
 * @return {Boolean}
 */
function isNodejs() {
  return typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined';
}

const hostingAPI = require("./hosting-api");
let hostingJSON

if (isNodejs()) {
  hostingJSON = require("./hosting-json");
}


function check(domain, db) {
  if (db && hostingJSON) {
    return hostingJSON.check(domain, db);
    return
  } else {
    return hostingAPI.check(domain);
  }
}

function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);

  return greenEntries.map(([key, val]) => val.url);
}

async function checkPage(pageXray, db) {
  const domains = Object.keys(pageXray.domains);
  return check(domains, db);
}

module.exports = {
  check,
  checkPage,
  greenDomains: greenDomainsFromResults,
  loadJSON: hostingJSON.loadJSON,
};
