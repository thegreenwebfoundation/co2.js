"use strict";

import hostingAPI from "./hosting-api.js";

/**
 * @module hosting
 */

/**
 * Check if a domain is hosted by a green web host.
 * @param {string|array} domain - The domain to check, or an array of domains to be checked.
 * @param {string} optionsOrAgentId - Optional. An object of domain check options, or a string
 *   representing the app, site, or organisation that is making the request.
 * @returns - A boolean if a string was provided, or an array of booleans if an array of domains was provided.
 *   if a string was provided for `domain`: a boolean indicating whether the domain is hosted by a green web host if `options.verbose` is false,
 *     otherwise an object representing the domain host information.
 *   if an array was provided for `domain`: an array of domains that are hosted by a green web host if `options.verbose` is false,
 *     otherwise a dictionary of domain to host information.
 */

export function check(domain, optionsOrAgentId) {
  return hostingAPI.check(domain, optionsOrAgentId);
}

export default { check };
