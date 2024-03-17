"use strict";

/**
 * @typedef {Object} CO2EstimateTraceResultPerByte
 * @property {number} co2 - The CO2 estimate in grams/kilowatt-hour
 * @property {boolean} green - Whether the domain is green or not
 * @property {TraceResultVariables} variables - The variables used to calculate the CO2 estimate
 */

/**
 * @typedef {Object} CO2EstimateTraceResultPerVisit
 * @property {number} co2 - The CO2 estimate in grams/kilowatt-hour
 * @property {boolean} green - Whether the domain is green or not
 * @property {TraceResultVariables} variables - The variables used to calculate the CO2 estimate
 */

/**
 * @typedef {Object} TraceResultVariablesPerByte
 * @property {GridIntensityVariables} gridIntensity - The grid intensity related variables
 */
/**
 * @typedef {Object} TraceResultVariablesPerVisit
 * @property {GridIntensityVariables} gridIntensity - The grid intensity related variables
 * @property {number} dataReloadRatio - What percentage of a page is reloaded on each subsequent page view
 * @property {number} firstVisitPercentage - What percentage of visits are loading this page for subsequent times
 * @property {number} returnVisitPercentage - What percentage of visits are loading this page for the second or more time
 */

/**
 * @typedef {Object} GridIntensityVariables
 * @property {string} description - The description of the variables
 * @property {number} network - The network grid intensity set by the user or the default
 * @property {number} dataCenter - The data center grid intensity set by the user or the default
 * @property {number} device - The device grid intensity set by the user or the default
 * @property {number} production - The production grid intensity set by the user or the default
 */

import OneByte from "./1byte.js";
import SustainableWebDesign from "./sustainable-web-design.js";

import {
  GLOBAL_GRID_INTENSITY,
  RENEWABLES_GRID_INTENSITY,
} from "./constants/index.js";
import { parseOptions } from "./helpers/index.js";

class CO2 {
  constructor(options) {
    this.model = new SustainableWebDesign();
    // Using optional chaining allows an empty object to be passed
    // in without breaking the code.
    if (options?.model === "1byte") {
      this.model = new OneByte();
    } else if (options?.model === "swd") {
      this.model = new SustainableWebDesign();
    } else if (options?.model) {
      throw new Error(
        `"${options.model}" is not a valid model. Please use "1byte" for the OneByte model, and "swd" for the Sustainable Web Design model.\nSee https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`
      );
    }

    /** @private */
    this._segment = options?.results === "segment";
  }

  /**
   * Accept a figure in bytes for data transfer, and a boolean for whether
   * the domain shows as 'green', and return a CO2 figure for energy used to shift the corresponding
   * the data transfer.
   *
   * @param {number} bytes
   * @param {boolean} green
   * @return {number} the amount of CO2 in grammes
   */
  perByte(bytes, green = false) {
    return this.model.perByte(bytes, green, this._segment);
  }

  /**
   * Accept a figure in bytes for data transfer, and a boolean for whether
   * the domain shows as 'green', and return a CO2 figure for energy used to shift the corresponding
   * the data transfer.
   *
   * @param {number} bytes
   * @param {boolean} green
   * @return {number} the amount of CO2 in grammes
   */
  perVisit(bytes, green = false) {
    if (this.model?.perVisit) {
      return this.model.perVisit(bytes, green, this._segment);
    } else {
      throw new Error(
        `The perVisit() method is not supported in the model you are using. Try using perByte() instead.\nSee https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`
      );
    }
  }

  /**
   * Accept a figure in bytes for data transfer, a boolean for whether
   * the domain shows as 'green', and an options object.
   * Returns an object containing CO2 figure, green boolean, and object of the variables used in calculating the CO2 figure.
   *
   * @param {number} bytes
   * @param {boolean} green
   * @param {Object} options
   * @return {CO2EstimateTraceResultPerByte} the amount of CO2 in grammes
   */
  perByteTrace(bytes, green = false, options = {}) {
    let adjustments = {};
    if (options) {
      // If there are options, parse them and add them to the model.
      adjustments = parseOptions(options);
    }
    return {
      co2: this.model.perByte(bytes, green, this._segment, adjustments),
      green,
      variables: {
        description:
          "Below are the variables used to calculate this CO2 estimate.",
        bytes,
        gridIntensity: {
          description:
            "The grid intensity (grams per kilowatt-hour) used to calculate this CO2 estimate.",
          network:
            adjustments?.gridIntensity?.network?.value ?? GLOBAL_GRID_INTENSITY,
          dataCenter: green
            ? RENEWABLES_GRID_INTENSITY
            : adjustments?.gridIntensity?.dataCenter?.value ??
              GLOBAL_GRID_INTENSITY,
          production: GLOBAL_GRID_INTENSITY,
          device:
            adjustments?.gridIntensity?.device?.value ?? GLOBAL_GRID_INTENSITY,
        },
      },
    };
  }

  /**
   * Accept a figure in bytes for data transfer, a boolean for whether
   * the domain shows as 'green', and an options object.
   * Returns an object containing CO2 figure, green boolean, and object of the variables used in calculating the CO2 figure.
   *
   * @param {number} bytes
   * @param {boolean} green
   * @param {Object} options
   * @return {CO2EstimateTraceResultPerVisit} the amount of CO2 in grammes
   */
  perVisitTrace(bytes, green = false, options = {}) {
    if (this.model?.perVisit) {
      let adjustments = {};
      if (options) {
        // If there are options, parse them and add them to the model.
        adjustments = parseOptions(options);
      }

      return {
        co2: this.model.perVisit(bytes, green, this._segment, adjustments),
        green,
        variables: {
          description:
            "Below are the variables used to calculate this CO2 estimate.",
          bytes,
          gridIntensity: {
            description:
              "The grid intensity (grams per kilowatt-hour) used to calculate this CO2 estimate.",
            network:
              adjustments?.gridIntensity?.network?.value ??
              GLOBAL_GRID_INTENSITY,
            dataCenter: green
              ? RENEWABLES_GRID_INTENSITY
              : adjustments?.gridIntensity?.dataCenter?.value ??
                GLOBAL_GRID_INTENSITY,
            production: GLOBAL_GRID_INTENSITY,
            device:
              adjustments?.gridIntensity?.device?.value ??
              GLOBAL_GRID_INTENSITY,
          },
          dataReloadRatio: adjustments?.dataReloadRatio ?? 0.02,
          firstVisitPercentage: adjustments?.firstVisitPercentage ?? 0.75,
          returnVisitPercentage: adjustments?.returnVisitPercentage ?? 0.25,
        },
      };
    } else {
      throw new Error(
        `The perVisitDetailed() method is not supported in the model you are using. Try using perByte() instead.\nSee https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`
      );
    }
  }
}

export { CO2 };
export default CO2;
