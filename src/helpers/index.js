import { averageIntensity } from "../index.js";
import {
  GLOBAL_GRID_INTENSITY as SWDM3_GLOBAL_GRID_INTENSITY,
  SWDV4,
  PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD,
  FIRST_TIME_VIEWING_PERCENTAGE,
  RETURNING_VISITOR_PERCENTAGE,
  SWDMV3_RATINGS,
  SWDMV4_RATINGS,
} from "../constants/index.js";

const SWDM4_GLOBAL_GRID_INTENSITY = SWDV4.GLOBAL_GRID_INTENSITY;
// Shared type definitions to be used across different files

/**
 * @typedef {Object} DomainCheckOptions options to control the behavior when checking a domain
 * @property {string} userAgentIdentifier - Optional. The app, site, or organisation that is making the request.
 * @property {boolean} verbose - Optional. Whether to return a verbose response.
 * @property {string[]} db - Optional. A database list to use for lookups.
 */

const formatNumber = (num) => parseFloat(num.toFixed(2));

const lessThanEqualTo = (num, limit) => num <= limit;

function parseByteTraceOptions(options = {}, version = 3, green = false) {
  const globalGridIntensity =
    version === 4 ? SWDM4_GLOBAL_GRID_INTENSITY : SWDM3_GLOBAL_GRID_INTENSITY;
  // CHeck that it is an object
  if (typeof options !== "object") {
    throw new Error("Options must be an object");
  }

  const adjustments = {};

  /**
   *
   * @param {string} segment The name of the segment ("device"|"dataCenter"|"network")
   * @param {number|object} segmentIntensity The segment intensity
   */
  function setIntensity(segment, segmentIntensity) {
    if (segmentIntensity || segmentIntensity === 0) {
      if (typeof segmentIntensity === "object") {
        if (!averageIntensity.data[segmentIntensity.country?.toUpperCase()]) {
          console.warn(
            `"${segmentIntensity.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information. \nFalling back to global average grid intensity.`
          );
          adjustments.gridIntensity[segment] = {
            value: globalGridIntensity,
          };
        }
        adjustments.gridIntensity[segment] = {
          country: segmentIntensity.country,
          value: parseFloat(
            averageIntensity.data[segmentIntensity.country?.toUpperCase()]
          ),
        };
      } else if (typeof segmentIntensity === "number") {
        adjustments.gridIntensity[segment] = {
          value: segmentIntensity,
        };
      } else {
        adjustments.gridIntensity[segment] = {
          value: globalGridIntensity,
        };
        console.warn(
          `The ${segment} grid intensity must be a number or an object. You passed in a ${typeof segmentIntensity}. \nFalling back to global average grid intensity.`
        );
      }
    } else {
      adjustments.gridIntensity[segment] = {
        value: globalGridIntensity,
      };
    }
  }

  if (options?.gridIntensity) {
    adjustments.gridIntensity = {};
    const { device, dataCenter, network } = options.gridIntensity;
    setIntensity("device", device);
    setIntensity("dataCenter", dataCenter);
    setIntensity("network", network);
  } else {
    adjustments.gridIntensity = {
      device: { value: globalGridIntensity },
      dataCenter: { value: globalGridIntensity },
      network: { value: globalGridIntensity },
    };
  }

  if (
    options?.greenHostingFactor ||
    (options.greenHostingFactor === 0 && version === 4)
  ) {
    if (typeof options.greenHostingFactor === "number") {
      if (options.greenHostingFactor >= 0 && options.greenHostingFactor <= 1) {
        adjustments.greenHostingFactor = options.greenHostingFactor;
      } else {
        adjustments.greenHostingFactor = 0;
        console.warn(
          `The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.greenHostingFactor = 0;
      console.warn(
        `The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. \nFalling back to default value.`
      );
    }
  } else if (version === 4) {
    adjustments.greenHostingFactor = 0;
  }

  if (green) {
    adjustments.greenHostingFactor = 1;
  }

  return adjustments;
}

function parseVisitTraceOptions(options = {}, version = 3, green = false) {
  // CHeck that it is an object
  if (typeof options !== "object") {
    throw new Error("Options must be an object");
  }

  const adjustments = parseByteTraceOptions(options, version, green);

  if (options?.dataReloadRatio || options.dataReloadRatio === 0) {
    if (typeof options.dataReloadRatio === "number") {
      if (options.dataReloadRatio >= 0 && options.dataReloadRatio <= 1) {
        adjustments.dataReloadRatio = options.dataReloadRatio;
      } else {
        adjustments.dataReloadRatio =
          version === 3 ? PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD : 0;
        console.warn(
          `The dataReloadRatio option must be a number between 0 and 1. You passed in ${options.dataReloadRatio}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.dataReloadRatio =
        version === 3 ? PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD : 0;
      console.warn(
        `The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}. \nFalling back to default value.`
      );
    }
  } else {
    adjustments.dataReloadRatio =
      version === 3 ? PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD : 0;
    console.warn(
      `The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}. \nFalling back to default value.`
    );
  }

  if (options?.firstVisitPercentage || options.firstVisitPercentage === 0) {
    if (typeof options.firstVisitPercentage === "number") {
      if (
        options.firstVisitPercentage >= 0 &&
        options.firstVisitPercentage <= 1
      ) {
        adjustments.firstVisitPercentage = options.firstVisitPercentage;
      } else {
        adjustments.firstVisitPercentage =
          version === 3 ? FIRST_TIME_VIEWING_PERCENTAGE : 1;
        console.warn(
          `The firstVisitPercentage option must be a number between 0 and 1. You passed in ${options.firstVisitPercentage}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.firstVisitPercentage =
        version === 3 ? FIRST_TIME_VIEWING_PERCENTAGE : 1;
      console.warn(
        `The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}. \nFalling back to default value.`
      );
    }
  } else {
    adjustments.firstVisitPercentage =
      version === 3 ? FIRST_TIME_VIEWING_PERCENTAGE : 1;
    console.warn(
      `The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}. \nFalling back to default value.`
    );
  }

  if (options?.returnVisitPercentage || options.returnVisitPercentage === 0) {
    if (typeof options.returnVisitPercentage === "number") {
      if (
        options.returnVisitPercentage >= 0 &&
        options.returnVisitPercentage <= 1
      ) {
        adjustments.returnVisitPercentage = options.returnVisitPercentage;
      } else {
        adjustments.returnVisitPercentage =
          version === 3 ? RETURNING_VISITOR_PERCENTAGE : 0;
        console.warn(
          `The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.returnVisitPercentage =
        version === 3 ? RETURNING_VISITOR_PERCENTAGE : 0;
      console.warn(
        `The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. \nFalling back to default value.`
      );
    }
  } else {
    adjustments.returnVisitPercentage =
      version === 3 ? RETURNING_VISITOR_PERCENTAGE : 0;
    console.warn(
      `The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. \nFalling back to default value.`
    );
  }

  return adjustments;
}

/**
 * Returns an object containing all the HTTP headers to use when making a request to the Green Web Foundation API.
 * @param {string} comment - Optional. The app, site, or organisation that is making the request.
 *
 * @returns {import('http').OutgoingHttpHeaders}
 */
function getApiRequestHeaders(comment = "") {
  return { "User-Agent": `co2js/${process.env.CO2JS_VERSION} ${comment}` };
}

/**
 * Returns the SWDM rating for a given CO2e value and version of the SWDM.
 * @param {number} co2e - The CO2e value to rate.
 * @param {number} swdmVersion - The version of the SWDM to use. Defaults to version 3.
 * @returns {string} The SWDM rating.
 */
function outputRating(co2e, swdmVersion) {
  let {
    FIFTH_PERCENTILE,
    TENTH_PERCENTILE,
    TWENTIETH_PERCENTILE,
    THIRTIETH_PERCENTILE,
    FORTIETH_PERCENTILE,
    FIFTIETH_PERCENTILE,
  } = SWDMV3_RATINGS;

  if (swdmVersion === 4) {
    FIFTH_PERCENTILE = SWDMV4_RATINGS.FIFTH_PERCENTILE;
    TENTH_PERCENTILE = SWDMV4_RATINGS.TENTH_PERCENTILE;
    TWENTIETH_PERCENTILE = SWDMV4_RATINGS.TWENTIETH_PERCENTILE;
    THIRTIETH_PERCENTILE = SWDMV4_RATINGS.THIRTIETH_PERCENTILE;
    FORTIETH_PERCENTILE = SWDMV4_RATINGS.FORTIETH_PERCENTILE;
    FIFTIETH_PERCENTILE = SWDMV4_RATINGS.FIFTIETH_PERCENTILE;
  }

  if (lessThanEqualTo(co2e, FIFTH_PERCENTILE)) {
    return "A+";
  } else if (lessThanEqualTo(co2e, TENTH_PERCENTILE)) {
    return "A";
  } else if (lessThanEqualTo(co2e, TWENTIETH_PERCENTILE)) {
    return "B";
  } else if (lessThanEqualTo(co2e, THIRTIETH_PERCENTILE)) {
    return "C";
  } else if (lessThanEqualTo(co2e, FORTIETH_PERCENTILE)) {
    return "D";
  } else if (lessThanEqualTo(co2e, FIFTIETH_PERCENTILE)) {
    return "E";
  } else {
    return "F";
  }
}

export {
  formatNumber,
  parseByteTraceOptions,
  parseVisitTraceOptions,
  getApiRequestHeaders,
  lessThanEqualTo,
  outputRating,
};
