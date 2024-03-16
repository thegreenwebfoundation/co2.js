"use strict";

import { getApiRequestHeaders } from "./helpers/index.js";
import hostingJSON from "./hosting-json.js";

/**
 * Check if a string or array of domains is hosted by a green web host by querying the Green Web Foundation API.
 * @param {string | string[]} domain - The domain to check, or an array of domains to be checked.
 * @param {string | DomainCheckOptions} optionsOrAgentId - Optional. An object of domain check options, or a string
 *   representing the app, site, or organisation that is making the request.
 */

function check(domain, optionsOrAgentId) {
  const options =
    typeof optionsOrAgentId === "string"
      ? { userAgentIdentifier: optionsOrAgentId }
      : optionsOrAgentId;

  if (options?.db && options.verbose) {
    throw new Error("verbose mode cannot be used with a local lookup database");
  }
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain, options);
  } else {
    return checkDomainsAgainstAPI(domain, options);
  }
}

/**
 * Check if a domain is hosted by a green web host by querying the Green Web Foundation API.
 * @param {string} domain - The domain to check.
 * @param {DomainCheckOptions} options
 * @returns {Promise<boolean>} - A boolean indicating whether the domain is hosted by a green web host if `options.verbose` is false,
 *   otherwise an object representing the domain host information.
 */
async function checkAgainstAPI(domain, options = {}) {
  const req = await fetch(
    `https://api.thegreenwebfoundation.org/greencheck/${domain}`,
    {
      headers: getApiRequestHeaders(options.userAgentIdentifier),
    }
  );
  if (options?.db) {
    return hostingJSON.check(domain, options.db);
  }
  const res = await req.json();
  return options.verbose ? res : res.green;
}

/**
 * Check if an array of domains is hosted by a green web host by querying the Green Web Foundation API.
 * @param {string[]} domains - An array of domains to check.
 * @param {DomainCheckOptions} options
 * @returns {Promise<string[]>} - An array of domains that are hosted by a green web host if `options.verbose` is false,
 *   otherwise a dictionary of domain to host information.
 */

async function checkDomainsAgainstAPI(domains, options = {}) {
  try {
    const apiPath = "https://api.thegreenwebfoundation.org/v2/greencheckmulti";
    const domainsString = JSON.stringify(domains);

    const req = await fetch(`${apiPath}/${domainsString}`, {
      headers: getApiRequestHeaders(options.userAgentIdentifier),
    });

    const allGreenCheckResults = await req.json();

    return options.verbose
      ? allGreenCheckResults
      : greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return options.verbose ? {} : [];
  }
}

/**
 * Extract the green domains from the results of a green check.
 * @param {object} greenResults - The results of a green check.
 * @returns {string[]} - An array of domains that are hosted by a green web host.
 */
function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);
  return greenEntries.map(([key, val]) => val.url);
}

export default {
  check,
};
