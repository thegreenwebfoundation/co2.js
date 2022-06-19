"use strict";

import hostingAPI from "./hosting-api";

function check(domain, db) {
  return hostingAPI.check(domain);
}

export default {
  check,
};
