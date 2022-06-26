"use strict";

import hostingAPI from "./hosting-api.js";

function check(domain, db) {
  return hostingAPI.check(domain);
}

export default {
  check,
};
