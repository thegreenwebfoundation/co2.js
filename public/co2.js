"use strict";
var co2 = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/co2.js
  var co2_exports = {};
  __export(co2_exports, {
    CO2: () => CO2,
    default: () => co2_default
  });

  // src/1byte.js
  var CO2_PER_KWH_IN_DC_GREY = 519;
  var CO2_PER_KWH_NETWORK_GREY = 475;
  var CO2_PER_KWH_IN_DC_GREEN = 0;
  var KWH_PER_BYTE_IN_DC = 72e-12;
  var FIXED_NETWORK_WIRED = 429e-12;
  var FIXED_NETWORK_WIFI = 152e-12;
  var FOUR_G_MOBILE = 884e-12;
  var KWH_PER_BYTE_FOR_NETWORK = (FIXED_NETWORK_WIRED + FIXED_NETWORK_WIFI + FOUR_G_MOBILE) / 3;
  var OneByte = class {
    constructor(options) {
      this.options = options;
      this.KWH_PER_BYTE_FOR_NETWORK = KWH_PER_BYTE_FOR_NETWORK;
    }
    perByte(bytes, green) {
      if (bytes < 1) {
        return 0;
      }
      if (green) {
        const Co2ForDC = bytes * KWH_PER_BYTE_IN_DC * CO2_PER_KWH_IN_DC_GREEN;
        const Co2forNetwork = bytes * KWH_PER_BYTE_FOR_NETWORK * CO2_PER_KWH_NETWORK_GREY;
        return Co2ForDC + Co2forNetwork;
      }
      const KwHPerByte = KWH_PER_BYTE_IN_DC + KWH_PER_BYTE_FOR_NETWORK;
      return bytes * KwHPerByte * CO2_PER_KWH_IN_DC_GREY;
    }
  };
  var byte_default = OneByte;

  // src/co2.js
  var CO2 = class {
    constructor(options) {
      this.options = options;
      this.model = new byte_default();
      if (options) {
        this.model = new options.model();
      }
    }
    perByte(bytes, green) {
      return this.model.perByte(bytes, green);
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
          transferSize: pageXray.domains[domain].transferSize
        });
      }
      co2PerDomain.sort((a, b) => b.co2 - a.co2);
      return co2PerDomain;
    }
    perPage(pageXray, green) {
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
        const co2ForTransfer = this.perByte(transferSize, greenDomains && greenDomains.indexOf(domain) > -1);
        const contentType = asset.type;
        if (!co2PerContentType[contentType]) {
          co2PerContentType[contentType] = { co2: 0, transferSize: 0 };
        }
        co2PerContentType[contentType].co2 += co2ForTransfer;
        co2PerContentType[contentType].transferSize += transferSize;
      }
      const all = [];
      for (let type of Object.keys(co2PerContentType)) {
        all.push({
          type,
          co2: co2PerContentType[type].co2,
          transferSize: co2PerContentType[type].transferSize
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
        const co2ForTransfer = this.perByte(transferSize, greenDomains && greenDomains.indexOf(domain) > -1);
        allAssets.push({ url: asset.url, co2: co2ForTransfer, transferSize });
      }
      allAssets.sort((a, b) => b.co2 - a.co2);
      return allAssets.slice(0, allAssets.length > 10 ? 10 : allAssets.length);
    }
    perParty(pageXray, greenDomains) {
      let firstParty = 0;
      let thirdParty = 0;
      const firstPartyRegEx = pageXray.firstPartyRegEx;
      for (let d of Object.keys(pageXray.domains)) {
        if (!d.match(firstPartyRegEx)) {
          thirdParty += this.perByte(pageXray.domains[d].transferSize, greenDomains && greenDomains.indexOf(d) > -1);
        } else {
          firstParty += this.perByte(pageXray.domains[d].transferSize, greenDomains && greenDomains.indexOf(d) > -1);
        }
      }
      return { firstParty, thirdParty };
    }
  };
  var co2_default = CO2;
  return __toCommonJS(co2_exports);
})();
//# sourceMappingURL=co2.js.map
