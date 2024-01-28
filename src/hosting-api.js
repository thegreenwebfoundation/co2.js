"use strict";

import { getApiRequestHeaders } from "./helpers/index.js";

/**
 * Check if a string or array of domains has been provided
 * @param {string|array} domain - The domain to check, or an array of domains to be checked.
 * @param {string} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 */

function check(domain, userAgentIdentifier) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain, userAgentIdentifier);
  } else {
    return checkDomainsAgainstAPI(domain, userAgentIdentifier);
  }
}

/**
 * Check if a domain is hosted by a green web host by querying the Green Web Foundation API.
 * @param {string} domain - The domain to check.
 * @param {string} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns {boolean} - A boolean indicating whether the domain is hosted by a green web host.
 */
async function checkAgainstAPI(domain, userAgentIdentifier) {
  const req = await fetch(
    `https://api.thegreenwebfoundation.org/greencheck/${domain}`,
    {
      headers: getApiRequestHeaders(userAgentIdentifier),
    }
  );
  const res = await req.json();
  return res.green;
}

/**
 * Check if an array of domains is hosted by a green web host by querying the Green Web Foundation API.
 * @param {array} domains - An array of domains to check.
 * @param {string} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns {array} - An array of domains that are hosted by a green web host.
 */

async function checkDomainsAgainstAPI(domains, userAgentIdentifier) {
  try {
    const apiPath = "https://api.thegreenwebfoundation.org/v2/greencheckmulti";
    const domainsString = JSON.stringify(domains);

    const req = await fetch(`${apiPath}/${domainsString}`, {
      headers: getApiRequestHeaders(userAgentIdentifier),
    });

    const allGreenCheckResults = await req.json();

    return greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return [];
  }
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

export default {
  check,
};
