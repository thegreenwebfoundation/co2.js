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
 * @param {string} comment - Optional. The app, site, or organisation that is making the request.
 * @return {string}
 */
async function getBody(url, comment) {
  return new Promise(function (resolve, reject) {
    // Do async job
    const req = https.get(
      url,
      { headers: getApiRequestHeaders(comment) },
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
 * @param {object} db - Optional. A database object to use for lookups.
 * @param {string} comment - Optional. The app, site, or organisation that is making the request.
 * @returns {boolean|array} - A boolean if a string was provided, or an array of booleans if an array of domains was provided.
 */

function check(domain, db, comment) {
  if (db) {
    return hostingJSON.check(domain, db);
  }

  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain, comment);
  } else {
    return checkDomainsAgainstAPI(domain, comment);
  }
}

/**
 * Check if a domain is hosted by a green web host by querying the Green Web Foundation API.
 * @param {string} domain - The domain to check.
 * @param {string} comment - Optional. The app, site, or organisation that is making the request.
 * @returns {boolean} - A boolean indicating whether the domain is hosted by a green web host.
 */
async function checkAgainstAPI(domain, comment) {
  const res = JSON.parse(
    await getBody(
      `https://api.thegreenwebfoundation.org/greencheck/${domain}`,
      comment
    )
  );
  return res.green;
}

/**
 * Check if an array of domains is hosted by a green web host by querying the Green Web Foundation API.
 * @param {array} domains - An array of domains to check.
 * @param {string} comment - Optional. The app, site, or organisation that is making the request.
 * @returns {array} - An array of domains that are hosted by a green web host.
 */
async function checkDomainsAgainstAPI(domains, comment) {
  try {
    const allGreenCheckResults = JSON.parse(
      await getBody(
        `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${JSON.stringify(
          domains
        )}`,
        comment
      )
    );
    return hostingJSON.greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return [];
  }
}

/**
 * Take the result of a pageXray and check the domains in it against the database.
 * @param {object} pageXray - The result of a pageXray.
 * @param {object} db - A database object to use for lookups.
 * @returns {array} - An array indicating whether the domain is hosted by a green web host.
 */
async function checkPage(pageXray, db) {
  const domains = Object.keys(pageXray.domains);
  return check(domains, db);
}

export default {
  check,
  checkPage,
  greendomains: hostingJSON.greenDomainsFromResults,
  loadJSON: hostingJSON.loadJSON,
};
