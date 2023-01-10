"use strict";

import OneByte from "./1byte.js";
import SustainableWebDesign from "./sustainable-web-design.js";

function parseOptions(options) {
  // CHeck that it is an object
  if (typeof options !== "object") {
    throw new Error("Options must be an object");
  }

  const adjustments = {};

  if (options?.gridIntensity) {
    adjustments.gridIntensity = {};
    const { device, dataCenter, network } = options.gridIntensity;
    if (device) {
      if (typeof device === "object" && device.country) {
        const averageIntensity =
          require("./data/average-intensities-2021.min.js").default;
        if (!averageIntensity.data[device.country]) {
          throw new Error(
            `"${device.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.`
          );
        }
        adjustments.gridIntensity["device"] = {
          country: device.country,
          value: parseFloat(averageIntensity.data[device.country]),
        };
      } else if (typeof device === "number") {
        adjustments.gridIntensity["device"] = {
          value: device,
        };
      } else {
        throw new Error(
          `The device grid intensity must be a number or an object. You passed in a ${typeof device}.`
        );
      }
    }
    if (dataCenter) {
      if (typeof dataCenter === "object" && dataCenter.country) {
        const averageIntensity =
          require("./data/average-intensities-2021.min.js").default;
        if (!averageIntensity.data[dataCenter.country]) {
          throw new Error(
            `"${dataCenter.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.`
          );
        }
        adjustments.gridIntensity["dataCenter"] = {
          country: dataCenter.country,
          value: parseFloat(averageIntensity.data[dataCenter.country]),
        };
      } else if (typeof dataCenter === "number") {
        adjustments.gridIntensity["dataCenter"] = {
          value: dataCenter,
        };
      } else {
        throw new Error(
          `The data center grid intensity must be a number or an object. You passed in a ${typeof dataCenter}.`
        );
      }
    }
    if (network) {
      if (typeof network === "object" && network.country) {
        const averageIntensity =
          require("./data/average-intensities-2021.min.js").default;
        if (!averageIntensity.data[network.country]) {
          throw new Error(
            `"${network.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.`
          );
        }
        adjustments.gridIntensity["network"] = {
          country: network.country,
          value: parseFloat(averageIntensity.data[network.country]),
        };
      } else if (typeof network === "number") {
        adjustments.gridIntensity["network"] = {
          value: network,
        };
      } else {
        throw new Error(
          `The network grid intensity must be a number or an object. You passed in a ${typeof network}.`
        );
      }
    }
  }

  if (options?.cachePercentage) {
    if (typeof options.cachePercentage === "number") {
      if (options.cachePercentage > 0 && options.cachePercentage < 1) {
        adjustments.cachePercentage = options.cachePercentage;
      } else {
        throw new Error(
          `The cachePercentage option must be a number between 0 and 1. You passed in ${options.cachePercentage}.`
        );
      }
    } else {
      throw new Error(
        `The cachePercentage option must be a number. You passed in a ${typeof options.cachePercentage}.`
      );
    }
  }

  if (options?.firstVisitPercentage) {
    if (typeof options.firstVisitPercentage === "number") {
      if (
        options.firstVisitPercentage > 0 &&
        options.firstVisitPercentage < 1
      ) {
        adjustments.firstVisitPercentage = options.firstVisitPercentage;
      } else {
        throw new Error(
          `The firstVisitPercentage option must be a number between 0 and 1. You passed in ${options.firstVisitPercentage}.`
        );
      }
    } else {
      throw new Error(
        `The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}.`
      );
    }
  }

  if (options?.returnVisitPercentage) {
    if (typeof options.returnVisitPercentage === "number") {
      if (
        options.returnVisitPercentage > 0 &&
        options.returnVisitPercentage < 1
      ) {
        adjustments.returnVisitPercentage = options.returnVisitPercentage;
      } else {
        throw new Error(
          `The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}.`
        );
      }
    } else {
      throw new Error(
        `The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}.`
      );
    }
  }

  return adjustments;
}

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
  perByte(bytes, green = false, options = {}) {
    let adjustments = {};
    if (options) {
      // If there are options, parse them and add them to the model.
      adjustments = parseOptions(options);
    }
    return this.model.perByte(bytes, green, adjustments);
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
  perVisit(bytes, green = false, options = {}) {
    if (this.model?.perVisit) {
      let adjustments = {};
      if (options) {
        // If there are options, parse them and add them to the model.
        adjustments = parseOptions(options);
      }

      return this.model.perVisit(bytes, green, adjustments);
    } else {
      throw new Error(
        `The perVisit() method is not supported in the model you are using. Try using perByte() instead.\nSee https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`
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
