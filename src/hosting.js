"use strict";

import hostingAPI from "./hosting-api.js";

/**
 * Check if a domain is hosted by a green web host.
 * @param {string | string[]} domain - The domain to check, or an array of domains to be checked.
 * @param {string} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @returns {Promise<boolean | string[]>} - A boolean if a string was provided, or an array of strings if an array of domains was provided.
 */
function check(domain, userAgentIdentifier) {
  return hostingAPI.check(domain, userAgentIdentifier);
}

export default {
  check,
};
