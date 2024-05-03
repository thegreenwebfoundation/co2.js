/*

We have a separate node-specific hosting.js file for node.
This uses the node-specific APIs for making http requests,
and doing lookups against local JSON and sqlite databases.
This is used in the CommonJS build of co2.js

This lets us keep the total library small, and dependencies minimal.
*/

import https from "https";

import hostingJSON from "./hosting-json.js";
import hostingJSONNode from "./hosting-json.node.js";
import { getApiRequestHeaders } from "./helpers/index.js";

/**
 * Accept a url and perform an http request, returning the body
 * for parsing as JSON.
 *
 * @param {string} url
 * @param {string} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @return {string}
 */
async function getBody(url, userAgentIdentifier) {
  return new Promise(function (resolve, reject) {
    // Do async job
    const req = https.get(
      url,
      { headers: getApiRequestHeaders(userAgentIdentifier) },
      function (res) {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(
            new Error(
              `Could not get info from: ${url}. Status Code: ${res.statusCode}`
            )
          );
        }
        const data = [];

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => resolve(Buffer.concat(data).toString()));
      }
    );
    req.end();
  });
}

/**
 * Check if a domain is hosted by a green web host.
 * @param {string|array} domain - The domain to check, or an array of domains to be checked.
 * @param {string[] | DomainCheckOptions} optionsOrDb - Optional. An object of domain check options, or a database list to use for lookups.
 * @param {string } userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns - A boolean if a string was provided, or an array of booleans if an array of domains was provided.
 *   if a string was provided for `domain`: a boolean indicating whether the domain is hosted by a green web host if `options.verbose` is false,
 *     otherwise an object representing the domain host information.
 *   if an array was provided for `domain`: an array of domains that are hosted by a green web host if `options.verbose` is false,
 *     otherwise a dictionary of domain to host information.
 */

function check(domain, optionsOrDb, userAgentIdentifier) {
  let db,
    options = {};
  if (!db && Array.isArray(optionsOrDb)) {
    db = optionsOrDb;
  } else {
    options = optionsOrDb;
    if (userAgentIdentifier) {
      options = { ...options, userAgentIdentifier };
    }
    db = optionsOrDb?.db;
  }

  if (db && options?.verbose) {
    throw new Error("verbose mode cannot be used with a local lookup database");
  }
  if (db) {
    return hostingJSON.check(domain, db);
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
 * @returns {boolean} - A boolean indicating whether the domain is hosted by a green web host if `options.verbose` is false,
 * otherwise an object representing the domain host information.
 */
async function checkAgainstAPI(domain, options = {}) {
  const res = JSON.parse(
    await getBody(
      `https://api.thegreenwebfoundation.org/greencheck/${domain}`,
      options.userAgentIdentifier
    )
  );
  return options.verbose ? res : res.green;
}

/**
 * Check if an array of domains is hosted by a green web host by querying the Green Web Foundation API.
 * @param {array} domains - An array of domains to check.
 * @param {DomainCheckOptions} options
 * @returns {array} - An array of domains that are hosted by a green web host if `options.verbose` is false,
 * otherwise a dictionary of domain to host information.
 */
async function checkDomainsAgainstAPI(domains, options = {}) {
  try {
    const allGreenCheckResults = JSON.parse(
      await getBody(
        `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${JSON.stringify(
          domains
        )}`,
        options.userAgentIdentifier
      )
    );
    return options.verbose
      ? allGreenCheckResults
      : hostingJSON.greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return options.verbose ? {} : [];
  }
}

export default {
  check,
  greendomains: hostingJSON.greenDomainsFromResults,
  loadJSON: hostingJSONNode.loadJSON,
};
