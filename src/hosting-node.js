/*

We have a separate node-specific hosting.js file for node.
This uses the node-specific APIs for making http requests,
and doing lookups against local JSON and sqlite databases.
This is used in the CommonJS build of co2.js

This lets us keep the total library small, and dependencies minimal.
*/

import https from "https";

import debugFactory from "debug";
const log = debugFactory("tgwf:hosting-node");

import hostingJSON from "./hosting-json.node.js";

/**
 * Accept a url and perform an http request, returning the body
 * for parsing as JSON.
 *
 * @param {string} url
 * @return {string}
 */
async function getBody(url) {
  return new Promise(function (resolve, reject) {
    // Do async job
    const req = https.get(url, function (res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        log(
          "Could not get info from the Green Web Foundation API, %s for %s",
          res.statusCode,
          url
        );
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      const data = [];

      res.on("data", (chunk) => {
        data.push(chunk);
      });

      res.on("end", () => resolve(Buffer.concat(data).toString()));
    });
    req.end();
  });
}

function check(domain, db) {
  if (db) {
    return hostingJSON.check(domain, db);
  }

  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain);
  } else {
    return checkDomainsAgainstAPI(domain);
  }
}

async function checkAgainstAPI(domain) {
  const res = JSON.parse(
    await getBody(`https://api.thegreenwebfoundation.org/greencheck/${domain}`)
  );
  return res.green;
}

async function checkDomainsAgainstAPI(domains) {
  try {
    const allGreenCheckResults = JSON.parse(
      await getBody(
        `https://api.thegreenwebfoundation.org/v2/greencheckmulti/${JSON.stringify(
          domains
        )}`
      )
    );
    return hostingJSON.greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return [];
  }
}

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
