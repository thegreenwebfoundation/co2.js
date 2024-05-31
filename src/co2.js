"use strict";

/**
 * @typedef {Object} CO2EstimateTraceResultPerByte
 * @property {number|CO2EstimateComponentsPerByte} co2 - The CO2 estimate in grams or its separate components
 * @property {boolean} green - Whether the domain is green or not
 * @property {TraceResultVariablesPerByte} variables - The variables used to calculate the CO2 estimate
 */

/**
 * @typedef {Object} CO2EstimateTraceResultPerVisit
 * @property {number|CO2EstimateComponentsPerVisit} co2 - The CO2 estimate in grams or its separate components
 * @property {boolean} green - Whether the domain is green or not
 * @property {TraceResultVariablesPerVisit} variables - The variables used to calculate the CO2 estimate
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

/**
 * @typedef {Object} CO2EstimateComponentsPerByte
 * @property {number} networkCO2 - The CO2 estimate for networking in grams
 * @property {number} dataCenterCO2 - The CO2 estimate for data centers in grams
 * @property {number} consumerDeviceCO2 - The CO2 estimate for consumer devices in grams
 * @property {number} productionCO2 - The CO2 estimate for device production in grams
 * @property {string} rating - The rating of the CO2 estimate based on the Sustainable Web Design Model
 * @property {number} total - The total CO2 estimate in grams
 */

/**
 * @typedef {Object} CO2EstimateComponentsPerVisit
 * @property {number} 'networkCO2 - first' - The CO2 estimate for networking in grams on first visit
 * @property {number} 'networkCO2 - subsequent' - The CO2 estimate for networking in grams on subsequent visits
 * @property {number} 'dataCenterCO2 - first' - The CO2 estimate for data centers in grams on first visit
 * @property {number} 'dataCenterCO2 - subsequent' - The CO2 estimate for data centers in grams on subsequent visits
 * @property {number} 'consumerDeviceCO2 - first' - The CO2 estimate for consumer devices in grams on first visit
 * @property {number} 'consumerDeviceCO2 - subsequent' - The CO2 estimate for consumer devices in grams on subsequent visits
 * @property {number} 'productionCO2 - first' - The CO2 estimate for device production in grams on first visit
 * @property {number} 'productionCO2 - subsequent' - The CO2 estimate for device production in grams on subsequent visits
 * @property {string} rating - The rating of the CO2 estimate based on the Sustainable Web Design Model
 * @property {number} total - The total CO2 estimate in grams
 */

import OneByte from "./1byte.js";
import SustainableWebDesignV3 from "./sustainable-web-design-v3.js";
import SustainableWebDesignV4 from "./sustainable-web-design-v4.js";

import {
  GLOBAL_GRID_INTENSITY,
  RENEWABLES_GRID_INTENSITY,
} from "./constants/index.js";
import { parseOptions } from "./helpers/index.js";

class CO2 {
  constructor(options) {
    this.model = new SustainableWebDesignV3();
    // Using optional chaining allows an empty object to be passed
    // in without breaking the code.
    if (options?.model === "1byte") {
      this.model = new OneByte();
    } else if (options?.model === "swd") {
      this.model = new SustainableWebDesignV3();
      if (options?.version === 4) {
        this.model = new SustainableWebDesignV4();
      }
    } else if (options?.model) {
      throw new Error(
        `"${options.model}" is not a valid model. Please use "1byte" for the OneByte model, and "swd" for the Sustainable Web Design model.\nSee https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`
      );
    }

    if (options?.rating && typeof options.rating !== "boolean") {
      throw new Error(
        `The rating option must be a boolean. Please use true or false.\nSee https://developers.thegreenwebfoundation.org/co2js/options/ to learn more about the options available in CO2.js.`
      );
    }

    // This flag checks to see if the model itself has a rating system.
    const allowRatings = !!this.model.allowRatings;

    /** @private */
    this._segment = options?.results === "segment";
    // This flag is set by the user to enable the rating system.
    this._rating = options?.rating === true;

    // The rating system is only supported in the Sustainable Web Design Model.
    if (!allowRatings && this._rating) {
      throw new Error(
        `The rating system is not supported in the model you are using. Try using the Sustainable Web Design model instead.\nSee https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`
      );
    }
  }

  /**
   * Accept a figure in bytes for data transfer, and a boolean for whether
   * the domain shows as 'green', and return a CO2 figure for energy used to shift the corresponding
   * the data transfer.
   *
   * @param {number} bytes
   * @param {boolean} green
   * @return {number|CO2EstimateComponentsPerByte} the amount of CO2 in grammes or its separate components
   */
  perByte(bytes, green = false) {
    return this.model.perByte(bytes, green, this._segment, this._rating);
  }

  /**
   * Accept a figure in bytes for data transfer, and a boolean for whether
   * the domain shows as 'green', and return a CO2 figure for energy used to shift the corresponding
   * the data transfer.
   *
   * @param {number} bytes
   * @param {boolean} green
   * @return {number|CO2EstimateComponentsPerVisit} the amount of CO2 in grammes or its separate components
   */
  perVisit(bytes, green = false) {
    if (this.model?.perVisit) {
      return this.model.perVisit(bytes, green, this._segment, this._rating);
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
      co2: this.model.perByte(
        bytes,
        green,
        this._segment,
        this._rating,
        adjustments
      ),
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
        co2: this.model.perVisit(
          bytes,
          green,
          this._segment,
          this._rating,
          adjustments
        ),
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
        `The perVisitTrace() method is not supported in the model you are using. Try using perByte() instead.\nSee https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`
      );
    }
  }
}

export { CO2 };
export default CO2;
