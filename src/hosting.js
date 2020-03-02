"use strict";

// const log = require("debug")("tgwf:hosting");
const hostingAPI = require("./hostingAPI");
const hostingDatabase = require("./hostingDatabase");

function check(domain, dbName) {
  if (dbName) {
    return hostingDatabase.check(domain, dbName);
  } else {
    return hostingAPI.check(domain);
  }
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

async function checkPage(pageXray) {
  const domains = Object.keys(pageXray.domains);
  return check(domains);
}

module.exports = {
  check,
  checkPage,
  greenDomains: greenDomainsFromResults
};
