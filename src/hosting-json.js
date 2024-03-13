"use strict";

/**
 * Check if a string or array of domains has been provided
 * @param {string|array} domain - The domain to check, or an array of domains to be checked.
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
 * @param {object} db - The database to check against.
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
 * @param {object} greenResults - The results of a green check.
 * @returns {array} - An array of domains that are hosted by a green web host.
 */
function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);

  return greenEntries.map(([key, val]) => val.url);
}

/**
 * Check if an array of domains is hosted by a green web host by querying the database.
 * @param {array} domains - An array of domains to check.
 * @param {object} db - The database to check against.
 * @returns {array} - An array of domains that are hosted by a green web host.
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

/**
 * Find the provided information a string or array of domains
 * @param {string|array} domain - The domain to check, or an array of domains to be checked.
 */
function find(domain, db) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return findInJSON(domain, db);
  } else {
    return findDomainsInJSON(domain, db);
  }
}

/**
 * Check if a domain is hosted by a green web host by querying the database.
 * @param {string} domain - The domain to check.
 * @param {object} db - The database to check against.
 * @returns {object} - An object representing the domain provided host information.
 */
function findInJSON(domain, db) {
  if (db.indexOf(domain) > -1) {
    return domain;
  }
  return {
    url: domain,
    green: false,
  };
}

/**
 * Check if an array of domains is hosted by a green web host by querying the database.
 * @param {array} domains - An array of domains to check.
 * @param {object} db - The database to check against.
 * @returns {array} - A dictionary of domain to provided host information.
 */
function findDomainsInJSON(domains, db) {
  const result = {};
  for (let domain of domains) {
    result[domain] = findInJSON(domain, db);
  }
  return result;
}

module.exports = {
  check,
  greenDomainsFromResults,
  find,
};
