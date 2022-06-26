"use strict";

import debugFactory from "debug";
const log = debugFactory("tgwf:hostingAPI");

function check(domain) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain);
  } else {
    return checkDomainsAgainstAPI(domain);
  }
}

async function checkAgainstAPI(domain) {
  const req = await fetch(
    `https://api.thegreenwebfoundation.org/greencheck/${domain}`
  );
  const res = await req.json();
  return res.green;
}

async function checkDomainsAgainstAPI(domains) {
  try {
    const apiPath = "https://api.thegreenwebfoundation.org/v2/greencheckmulti";
    const domainsString = JSON.stringify(domains);

    const req = await fetch(`${apiPath}/${domainsString}`);

    // sanity check API result. Is this the library or
    // the actual API request that's the problem?
    // Is nock mocking node-native fetch API calls properly?
    log(`${apiPath}/${domainsString}`);
    log({ req });
    const textResult = await req.text();
    log({ textResult });

    const allGreenCheckResults = await req.json();

    return greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return [];
  }
}

function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);
  return greenEntries.map(([key, val]) => val.url);
}

export default {
  check,
};
