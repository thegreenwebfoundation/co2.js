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

  perDomain(pageXray, greenDomains) {
    const co2PerDomain = [];
    for (let domain of Object.keys(pageXray.domains)) {
      let co2;
      if (greenDomains && greenDomains.indexOf(domain) > -1) {
        co2 = this.perByte(pageXray.domains[domain].transferSize, true);
      } else {
        co2 = this.perByte(pageXray.domains[domain].transferSize);
      }
      co2PerDomain.push({
        domain,
        co2,
        transferSize: pageXray.domains[domain].transferSize,
      });
    }
    co2PerDomain.sort((a, b) => b.co2 - a.co2);

    return co2PerDomain;
  }

  perPage(pageXray, green) {
    // Accept an xray object, and if we receive a boolean as the second
    // argument, we assume every request we make is sent to a server
    // running on renwewable power.

    // if we receive an array of domains, return a number accounting the
    // reduced CO2 from green hosted domains

    const domainCO2 = this.perDomain(pageXray, green);
    let totalCO2 = 0;
    for (let domain of domainCO2) {
      totalCO2 += domain.co2;
    }
    return totalCO2;
  }

  perContentType(pageXray, greenDomains) {
    const co2PerContentType = {};
    for (let asset of pageXray.assets) {
      const domain = new URL(asset.url).domain;
      const transferSize = asset.transferSize;
      const co2ForTransfer = this.perByte(
        transferSize,
        greenDomains && greenDomains.indexOf(domain) > -1
      );
      const contentType = asset.type;
      if (!co2PerContentType[contentType]) {
        co2PerContentType[contentType] = { co2: 0, transferSize: 0 };
      }
      co2PerContentType[contentType].co2 += co2ForTransfer;
      co2PerContentType[contentType].transferSize += transferSize;
    }
    // restructure and sort
    const all = [];
    for (let type of Object.keys(co2PerContentType)) {
      all.push({
        type,
        co2: co2PerContentType[type].co2,
        transferSize: co2PerContentType[type].transferSize,
      });
    }
    all.sort((a, b) => b.co2 - a.co2);
    return all;
  }

  dirtiestResources(pageXray, greenDomains) {
    const allAssets = [];
    for (let asset of pageXray.assets) {
      const domain = new URL(asset.url).domain;
      const transferSize = asset.transferSize;
      const co2ForTransfer = this.perByte(
        transferSize,
        greenDomains && greenDomains.indexOf(domain) > -1
      );
      allAssets.push({ url: asset.url, co2: co2ForTransfer, transferSize });
    }
    allAssets.sort((a, b) => b.co2 - a.co2);

    return allAssets.slice(0, allAssets.length > 10 ? 10 : allAssets.length);
  }

  perParty(pageXray, greenDomains) {
    let firstParty = 0;
    let thirdParty = 0;
    // calculate co2 per first/third party
    const firstPartyRegEx = pageXray.firstPartyRegEx;
    for (let d of Object.keys(pageXray.domains)) {
      if (!d.match(firstPartyRegEx)) {
        thirdParty += this.perByte(
          pageXray.domains[d].transferSize,
          greenDomains && greenDomains.indexOf(d) > -1
        );
      } else {
        firstParty += this.perByte(
          pageXray.domains[d].transferSize,
          greenDomains && greenDomains.indexOf(d) > -1
        );
      }
    }
    return { firstParty, thirdParty };
  }
}

export { CO2 };
export default CO2;
