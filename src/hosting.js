"use strict";

import hostingAPI from "./hosting-api.js";

/**
 * Check if a domain is hosted by a green web host.
 * @param {string|array} domain - The domain to check, or an array of domains to be checked.
 * @param {object} db - OPTIONAL. A copy of the Green Web Dataset. If this is not provided, checks will be performed against the Green Web Foundation API.
 * @returns {boolean|array} - A boolean if a string was provided, or an array of booleans if an array of domains was provided.
 */
function check(domain, db) {
  return hostingAPI.check(domain);
}

export default {
  check,
};
