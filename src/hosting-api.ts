/**
 * TODO: This module uses HTTPS from node, which make it unsuitable for usage in browsers.
 */
import https from "https";

import debug from "debug";

const log = debug("tgwf:hostingAPI");

export interface GreenCheck {
  green: boolean;
  url: string;
  data: boolean;
  hostedby?: string;
  hostedbyid?: number;
  hostedbywebsite?: string;
  partner?: any;
}

function check(domain: string | any) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkAgainstAPI(domain);
  } else {
    return checkDomainsAgainstAPI(domain);
  }
}

async function checkAgainstAPI(domain: string): Promise<boolean> {
  const res = JSON.parse(
    await getBody(`https://api.thegreenwebfoundation.org/greencheck/${domain}`)
  );
  return res.green;
}

async function checkDomainsAgainstAPI(domains: string[]) {
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

function greenDomainsFromResults(greenResults: GreenCheck): string[] {
  const entries = Object.entries(greenResults);
  // we could chain this filter with map
  const greenEntries = entries.filter(function([, val]) {
    return val.green;
  });

  return greenEntries.map(function([, val]: GreenCheck[]) {
    return val.url;
  });
}

async function getBody(url: string): Promise<string> {
  // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job
    const req = https.get(url, function(res) {
      if (
        (res.statusCode && res.statusCode < 200) ||
        (res.statusCode && res.statusCode >= 300)
      ) {
        log(
          "Could not get info from the Green Web Foundation API, %s for %s",
          res.statusCode,
          url
        );
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      const data: any = [];

      res.on("data", chunk => {
        data.push(chunk);
      });

      res.on("end", () => resolve(Buffer.concat(data).toString()));
    });
    req.end();
  });
}

export { check };
