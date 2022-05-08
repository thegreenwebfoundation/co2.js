"use strict";

const log = require("debug")("tgwf:hosting");
const hostingAPI = require("./hosting-api");
const hostingJSON = require("./hosting-json");

function check(domain, db) {
  if (db) {
    return hostingJSON.check(domain, db);
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
