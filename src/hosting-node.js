/*

We have a separate node-specific hosting.js file for node.
This uses the node-specific APIs for making http requests,
and doing lookups against local JSON and sqlite databases.
This is used in the CommonJS build of co2.js

This lets us keep the total library small, and dependencies minimal.
*/

import https from "https";

import hostingJSON from "./hosting-json.node.js";
import { getApiRequestHeaders } from "./helpers/index.js";

/**
 * Accept a url and perform an http request, returning the body
 * for parsing as JSON.
 *
 * @param {string} url
 * @param {string=} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @return {Promise<string>}
 */
async function getBody(url, userAgentIdentifier) {
  return new Promise(function (resolve, reject) {
    // Do async job
    const req = https.get(
      url,
      { headers: getApiRequestHeaders(userAgentIdentifier) },
      function (res) {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          return reject(
            new Error(
              `Could not get info from: ${url}. Status Code: ${res.statusCode}`
            )
          );
        }
        /** @type {Buffer[]} */
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
 * @param {string|string[]} domain - The domain to check, or an array of domains to be checked.
 * @param {string[]=} db - Optional. A database object to use for lookups.
 * @param {string=} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns {Promise<boolean|string[]>} - A boolean if a string was provided, or an array of booleans if an array of domains was provided.
 */

function check(domain, db, userAgentIdentifier) {
  if (db) {
    return hostingJSON.check(domain, db);
  }

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
 * @param {string=} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns {Promise<boolean>} - A boolean indicating whether the domain is hosted by a green web host.
 */
async function checkAgainstAPI(domain, userAgentIdentifier) {
  const res = JSON.parse(
    await getBody(
      `https://api.thegreenwebfoundation.org/greencheck/${domain}`,
      userAgentIdentifier
    )
  );
  return res.green;
}

/**
 * Check if an array of domains is hosted by a green web host by querying the Green Web Foundation API.
 * @param {string[]} domains - An array of domains to check.
 * @param {string=} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns {Promise<string[]>} - An array of domains that are hosted by a green web host.
 */
async function checkDomainsAgainstAPI(domains, userAgentIdentifier) {
  try {
    const allGreenCheckResults = JSON.parse(
      await getBody(
        `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${JSON.stringify(
          domains
        )}`,
        userAgentIdentifier
      )
    );
    return hostingJSON.greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return [];
  }
}

export default {
  check,
  greendomains: hostingJSON.greenDomainsFromResults,
  loadJSON: hostingJSON.loadJSON,
};
