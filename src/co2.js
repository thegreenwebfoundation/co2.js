"use strict";

import OneByte from "./1byte.js";
import SustainableWebDesign from "./sustainable-web-design.js";

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

    if (options?.gridIntensity) {
      this.model.gridIntensity = {};
      const { device, dataCenter } = options.gridIntensity;
      if (device) {
        // Check if device is an object with a value property
        if (typeof device === "object" && device.value) {
          // Check if the value is a number
          if (typeof device.value === "number") {
            this.model.gridIntensity["device"] = {
              value: device.value,
            };
          } else {
            throw new Error(
              `The value for device grid intensity must be a number. You passed in a ${typeof device.value}.`
            );
          }
        } else if (typeof device === "object" && device.country) {
          const averageIntensity =
            require("./data/average-intensities-2021.min.js").default;
          if (!averageIntensity.data[device.country]) {
            throw new Error(
              `"${device.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.`
            );
          }
          this.model.gridIntensity["device"] = {
            country: device.country,
            value: parseFloat(averageIntensity.data[device.country]),
          };
        }
      }
      if (dataCenter) {
        // Check if device is an object with a value property
        if (typeof dataCenter === "object" && dataCenter.value) {
          // Check if the value is a number
          if (typeof dataCenter.value === "number") {
            this.model.gridIntensity.dataCenter = {
              value: dataCenter.value,
            };
          } else {
            throw new Error(
              `The value for device grid intensity must be a number. You passed in a ${typeof device.value}.`
            );
          }
        } else if (typeof dataCenter === "object" && dataCenter.country) {
          const averageIntensity =
            require("./data/average-intensities-2021.min.js").default;
          if (!averageIntensity.data[dataCenter.country]) {
            throw new Error(
              `"${dataCenter.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.`
            );
          }
          this.model.gridIntensity["dataCenter"] = {
            country: dataCenter.country,
            value: parseFloat(averageIntensity.data[dataCenter.country]),
          };
        }
      }
    }

    if (options?.cachePercentage) {
      if (typeof options.cachePercentage === "number") {
        this.model.cachePercentage = options.cachePercentage;
      } else {
        throw new Error(
          `The cachePercentage option must be a number. You passed in a ${typeof options.cachePercentage}.`
        );
      }
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
  perByte(bytes, green) {
    return this.model.perByte(bytes, green);
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
      const gridIntensity = this.model?.gridIntensity || green;
      return this.model.perVisit(bytes, gridIntensity, {
        cachePercentage: this.model.cachePercentage,
      });
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
