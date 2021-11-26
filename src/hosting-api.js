"use strict";

const log = require("debug")("tgwf:hostingAPI");
const https = require("https");

function check(domain) {
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
    return greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
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

async function getBody(url) {
  // Return new promise
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

module.exports = {
  check,
};
