import debug from "debug";
import fs from "fs";
import { promisify } from "util";
import { GreenCheck } from "./hosting-api";

const log = debug("tgwf:hostingCache");

const readFile = promisify(fs.readFile);

async function loadJSON(jsonPath: string) {
  const jsonBuffer = await readFile(jsonPath);
  return JSON.parse(jsonBuffer.toString());
}

async function check(domain: string | string[], db: any) {
  // is it a single domain or an array of them?
  if (typeof domain === "string") {
    return checkInJSON(domain, db);
  } else {
    return checkDomainsInJSON(domain, db);
  }
}

function checkInJSON(domain: string | string[], db: any) {
  return db.indexOf(domain) > -1;
}

function greenDomainsFromResults(greenResults: GreenCheck[]) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(function([key, val]) {
    return val.green;
  });

  return greenEntries.map(function([key, val]) {
    return val.url;
  });
}

function checkDomainsInJSON(domains: string[], db: any) {
  const greenDomains = [];

  for (const domain of domains) {
    if (db.indexOf(domain) > -1) {
      greenDomains.push(domain);
    }
  }
  return greenDomains;
}

export { check, loadJSON };
