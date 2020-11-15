import debug from "debug";
import * as hostingAPI from "./hosting-api";
import * as hostingJSON from "./hosting-json";
import { PageXRayResult } from "../types";
import { GreenCheck } from "./hosting-api";

const loadJSON = hostingJSON.loadJSON;

const log = debug("tgwf:hosting");

function check(domain: string | string[], db?: any) {
  if (db) {
    return hostingJSON.check(domain, db);
  } else {
    return hostingAPI.check(domain);
  }
}

function greenDomainsFromResults(greenResults: GreenCheck) {
  const entries = Object.entries(greenResults);
  // this filter could be chained with the next map function
  const greenEntries = entries.filter(function([, val]) {
    return val.green;
  });

  return greenEntries.map(function([, val]) {
    return val.url;
  });
}

async function checkPage(pageXray: PageXRayResult) {
  const domains = Object.keys(pageXray.domains);
  return check(domains);
}

export { check, checkPage, greenDomainsFromResults as greenDomains, loadJSON };
