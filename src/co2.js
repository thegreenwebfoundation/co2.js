"use strict";

import OneByte from "./1byte.js";
import SustainableWebDesign from "./sustainable-web-design.js";

import {
  GLOBAL_GRID_INTENSITY,
  RENEWABLES_GRID_INTENSITY,
} from "./constants/index.js";
import { parseOptions, toTotalCO2 } from "./helpers/index.js";

class CO2 {
  /**
   * @param {object} options
   * @param {'1byte' | 'swd'=} options.model The model to use (OneByte or Sustainable Web Design)
   * @param {'segment'=} options.results Optional. Whether to return segment-level emissions estimates.
   */
  constructor(options = {}) {
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
   * @return {number | CO2ByComponentWithTotal} the amount of CO2 in grammes
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
   * @return {number | AdjustedCO2ByComponentWithTotal} the amount of CO2 in grammes
   */
  perVisit(bytes, green = false) {
    if ("perVisit" in this.model) {
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
   * @param {ModelOptions} options
   * @return {CO2EstimateTraceResultPerByte} the amount of CO2 in grammes
   */
  perByteTrace(bytes, green = false, options = {}) {
    /** @type {ModelAdjustments | undefined} */
    let adjustments;
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
   * @param {ModelOptions} options
   * @return {CO2EstimateTraceResultPerVisit} the amount of CO2 in grammes
   */
  perVisitTrace(bytes, green = false, options = {}) {
    if ("perVisit" in this.model) {
      /** @type {ModelAdjustments | undefined} */
      let adjustments;
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

  /**
   *
   * @param {PageXRay} pageXray
   * @param {string[]=} greenDomains
   * @returns {CO2PerDomain[]}
   */
  perDomain(pageXray, greenDomains) {
    /** @type {CO2PerDomain[]} */
    const co2PerDomain = [];
    for (let domain of Object.keys(pageXray.domains)) {
      /** @type {number} */
      let co2;
      if (greenDomains && greenDomains.indexOf(domain) > -1) {
        co2 = toTotalCO2(
          this.perByte(pageXray.domains[domain].transferSize, true)
        );
      } else {
        co2 = toTotalCO2(this.perByte(pageXray.domains[domain].transferSize));
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

  /**
   *
   * @param {PageXRay} pageXray
   * @param {string[]=} green
   */
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

  /**
   * @param {PageXRay} pageXray
   * @param {string[]=} greenDomains
   * @returns {CO2PerContentType[]}
   */
  perContentType(pageXray, greenDomains) {
    /** @type {Record<string, Omit<CO2PerContentType, 'type'>>} */
    const co2PerContentType = {};
    for (let asset of pageXray.assets) {
      // TODO (simon) check that this `domain` -> `host` conversion is correct
      const domain = new URL(asset.url).host;
      const transferSize = asset.transferSize;
      const co2ForTransfer = toTotalCO2(
        this.perByte(
          transferSize,
          greenDomains && greenDomains.indexOf(domain) > -1
        )
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

  /**
   *
   * @param {PageXRay} pageXray
   * @param {string[]=} greenDomains
   */
  dirtiestResources(pageXray, greenDomains) {
    /** @type {CO2PerContentAsset[]} */
    const allAssets = [];
    for (let asset of pageXray.assets) {
      const domain = new URL(asset.url).host;
      const transferSize = asset.transferSize;
      const co2ForTransfer = toTotalCO2(
        this.perByte(
          transferSize,
          greenDomains && greenDomains.indexOf(domain) > -1
        )
      );
      allAssets.push({ url: asset.url, co2: co2ForTransfer, transferSize });
    }
    allAssets.sort((a, b) => b.co2 - a.co2);

    return allAssets.slice(0, allAssets.length > 10 ? 10 : allAssets.length);
  }

  /**
   * @param {PageXRay} pageXray
   * @param {string[]=} greenDomains
   */
  perParty(pageXray, greenDomains) {
    let firstParty = 0;
    let thirdParty = 0;
    // calculate co2 per first/third party
    const firstPartyRegEx = pageXray.firstPartyRegEx;
    for (let d of Object.keys(pageXray.domains)) {
      if (!d.match(firstPartyRegEx)) {
        thirdParty += toTotalCO2(
          this.perByte(
            pageXray.domains[d].transferSize,
            greenDomains && greenDomains.indexOf(d) > -1
          )
        );
      } else {
        firstParty += toTotalCO2(
          this.perByte(
            pageXray.domains[d].transferSize,
            greenDomains && greenDomains.indexOf(d) > -1
          )
        );
      }
    }
    return { firstParty, thirdParty };
  }
}

export { CO2 };
export default CO2;
