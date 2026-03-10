"use strict";

import { getApiRequestHeaders } from "./helpers/index.js";

/**
 * @module carbontxt-validator
 */

/**
 * Process the response from the carbon.txt validator API
 * @param {object} res - The response object from the API
 * @param {boolean} verbose - Optional. Whether to return verbose results
 * @returns {object} - The processed response object
 */
const processResponse = (res, verbose = false) => {
  // This captures errors when an invalid domain is sent to the API
  if (!res.success && !res.errors) {
    return {
      success: false,
      errors: [res.detail[0].msg],
    };
  }

  if (verbose) {
    return res;
  }

  if (!res.success) {
    return { success: false, errors: res.errors };
  }

  return {
    success: true,
    url: res.url,
    disclosures: res?.data?.org?.disclosures,
    upstream: res?.data?.upstream?.services,
  };
};

/**
 * Perform a domain lookup using the Green Web Foundation carbon.txt validator endpoint
 * @param {string} domain - The domain to check, or an array of domains to be checked.
 * @param {string} options - Optional. An object of domain check options, or a string
 * @param {string} options.userAgentIdentifier - Optional. A string representing the app, site, or organisation that is making the request.
 * @param {string} options.verbose - Optional. A boolean indicating whether to return verbose results.
 */

export async function check(domain, options) {
  if (typeof domain !== "string") {
    throw new Error("Invalid domain. Domain must be a string.");
  }

  const agentId = options?.userAgentIdentifier;
  const verbose = options?.verbose || false;

  const req = await fetch(
    `https://carbon-txt-api.greenweb.org/api/validate/domain/`,
    {
      headers: getApiRequestHeaders(agentId),
      method: "POST",
      body: JSON.stringify({ domain }),
    }
  );

  const res = await req.json();
  return processResponse(res, verbose);
}

export default check;
