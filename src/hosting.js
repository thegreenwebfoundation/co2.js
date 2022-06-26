"use strict";

import debugFactory from "debug";
const log = debugFactory("tgwf:hosting");

import hostingAPI from "./hosting-api.js";

function check(domain, db) {
  return hostingAPI.check(domain);
}

export default {
  check,
};
