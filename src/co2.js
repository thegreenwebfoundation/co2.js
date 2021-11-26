"use strict";

const url = require("url");
const oneByte = require("./1byte.js");

const KWH_PER_BYTE_IN_DC = oneByte.KWH_PER_BYTE_IN_DC;
const KWH_PER_BYTE_FOR_NETWORK = oneByte.KWH_PER_BYTE_FOR_NETWORK;
const CO2_PER_KWH_IN_DC_GREY = oneByte.CO2_PER_KWH_IN_DC_GREY;

// this figure is from the IEA's 2018 report for a global average:
const CO2_PER_KWH_NETWORK_GREY = 475;

// The IEA figures cover electricity but as far as I can tell, it does not
// cover life cycle emissions, and the 1byte models appears to do the same
// so, we use zero emissions for green infra in the DC
// https://github.com/thegreenwebfoundation/co2.js/issues/2
const CO2_PER_KWH_IN_DC_GREEN = 0;

class CO2 {
  constructor(options) {
    this.options = options;
  }

  perByte(bytes, green) {
    // return a CO2 figure for energy used to shift the corresponding
    // the data transfer.

    if (bytes < 1) {
      return 0;
    }

    if (green) {
      // if we have a green datacentre, use the lower figure for renewable energy
      const Co2ForDC = bytes * KWH_PER_BYTE_IN_DC * CO2_PER_KWH_IN_DC_GREEN;

      // but for the rest of the internet, we can't easily check, so assume
      // grey for now
      const Co2forNetwork =
        bytes * KWH_PER_BYTE_FOR_NETWORK * CO2_PER_KWH_NETWORK_GREY;

      return Co2ForDC + Co2forNetwork;
    }

    const KwHPerByte = KWH_PER_BYTE_IN_DC + KWH_PER_BYTE_FOR_NETWORK;
    return bytes * KwHPerByte * CO2_PER_KWH_IN_DC_GREY;
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
    co2PerDomain.sort(function (a, b) {
      return b.co2 - a.co2;
    });

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
      const domain = url.parse(asset.url).domain;
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
    all.sort(function (a, b) {
      return b.co2 - a.co2;
    });
    return all;
  }

  dirtiestResources(pageXray, greenDomains) {
    const allAssets = [];
    for (let asset of pageXray.assets) {
      const domain = url.parse(asset.url).domain;
      const transferSize = asset.transferSize;
      const co2ForTransfer = this.perByte(
        transferSize,
        greenDomains && greenDomains.indexOf(domain) > -1
      );
      allAssets.push({ url: asset.url, co2: co2ForTransfer, transferSize });
    }
    allAssets.sort(function (a, b) {
      return b.co2 - a.co2;
    });

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

module.exports = CO2;
