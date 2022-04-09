"use strict";

const log = require("debug")("tgwf:hostingAPI");
const fetch = require("cross-fetch");

function check(domain) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain);
  } else {
    return checkDomainsAgainstAPI(domain);
  }
}

async function checkAgainstAPI(domain) {
  const response = await fetch(
    `https://api.thegreenwebfoundation.org/greencheck/${domain}`
  );
  const data = await response.json();
  return data.green;
}

async function checkDomainsAgainstAPI(domains) {
  try {
    const domainsStr = JSON.stringify(domains);
    const response = await fetch(
      `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${domainsStr}`
    );
    const allGreenCheckResults = await response.json();
    return greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    log(e);
    return [];
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

module.exports = {
  check,
};
