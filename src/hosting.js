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
  let greenEntries = entries.filter(function ([key, val]) {
    return val.green;
  });

  return greenEntries.map(function ([key, val]) {
    return val.url;
  });
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
