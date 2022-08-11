"use strict";

/**
 * Sustainable Web Design
 *
 * Updated calculations and figures from
 * https://sustainablewebdesign.org/calculating-digital-emissions/
 *
 *
 */
import debugFactory from "debug";
const log = debugFactory("tgwf:sustainable-web-design");

import { fileSize } from "./constants/index.js";
import { formatNumber } from "./helpers/index.js";

// this refers to the estimated total energy use for the internet around 2000 TWh,
// divided by the total transfer it enables around 2500 exabytes
const KWH_PER_GB = 0.81;

// these constants outline how the energy is attributed to
// different parts of the system in the SWD model
const END_USER_DEVICE_ENERGY = 0.52;
const NETWORK_ENERGY = 0.14;
const DATACENTER_ENERGY = 0.15;
const PRODUCTION_ENERGY = 0.19;

// These carbon intensity figures https://ember-climate.org/data/data-explorer
// - Global carbon intensity for 2021
const GLOBAL_INTENSITY = 442;
const RENEWABLES_INTENSITY = 50;

// Taken from: https://gitlab.com/wholegrain/carbon-api-2-0/-/blob/master/includes/carbonapi.php

const FIRST_TIME_VIEWING_PERCENTAGE = 0.75;
const RETURNING_VISITOR_PERCENTAGE = 0.25;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;

class SustainableWebDesign {
  constructor(options) {
    this.options = options;
  }

  /**
   * Accept a figure for bytes transferred and return an object representing
   * the share of the total enrgy use of the entire system, broken down
   * by each corresponding system component
   *
   * @param {number}  bytes - the data transferred in bytes
   * @return {object} Object containing the energy in kilowatt hours, keyed by system component
   */
  energyPerByteByComponent(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const energyUsage = transferedBytesToGb * KWH_PER_GB;

    // return the total energy, with breakdown by component
    return {
      consumerDeviceEnergy: energyUsage * END_USER_DEVICE_ENERGY,
      networkEnergy: energyUsage * NETWORK_ENERGY,
      productionEnergy: energyUsage * PRODUCTION_ENERGY,
      dataCenterEnergy: energyUsage * DATACENTER_ENERGY,
    };
  }
  /**
   * Accept an object keys by the different system components, and
   * return an object with the co2 figures key by the each component
   *
   * @param {object} energyBycomponent - energy grouped by the four system components
   * @param {number} [carbonIntensity] - carbon intensity to apply to the datacentre values
   * @return {number} the total number in grams of CO2 equivalent emissions
   */
  co2byComponent(energyBycomponent, carbonIntensity = GLOBAL_INTENSITY) {
    const returnCO2ByComponent = {};
    for (const [key, value] of Object.entries(energyBycomponent)) {
      // we update the datacentre, as that's what we have information
      // about.
      if (key.startsWith("dataCenterEnergy")) {
        returnCO2ByComponent[key] = value * carbonIntensity;
      } else {
        // We don't have info about the device location,
        // nor the network path used, nor the production emissions
        // so we revert to global figures
        returnCO2ByComponent[key] = value * GLOBAL_INTENSITY;
      }
    }
    return returnCO2ByComponent;
  }

  /**
   * Accept a figure for bytes transferred and return a single figure for CO2
   * emissions. Where information exists about the origin data is being
   * fetched from, a different carbon intensity figure
   * is applied for the datacentre share of the carbon intensity.
   *
   * @param {number} bytes - the data transferred in bytes
   * @param {number} `carbonIntensity` the carbon intensity for datacentre (average figures, not marginal ones)
   * @return {number} the total number in grams of CO2 equivalent emissions
   */
  perByte(bytes, carbonIntensity = GLOBAL_INTENSITY) {
    const energyBycomponent = this.energyPerByteByComponent(bytes);

    // when faced with falsy values, fallback to global intensity
    if (Boolean(carbonIntensity) === false) {
      carbonIntensity = GLOBAL_INTENSITY;
    }
    // if we have a boolean, we have a green result from the green web checker
    // use the renewables intensity
    if (carbonIntensity === true) {
      carbonIntensity = RENEWABLES_INTENSITY;
    }

    // otherwise when faced with non numeric values throw an error
    if (typeof carbonIntensity !== "number") {
      throw new Error(
        `perByte expects a numeric value or boolean for the carbon intensity value. Received: ${carbonIntensity}`
      );
    }

    const co2ValuesbyComponent = this.co2byComponent(
      energyBycomponent,
      carbonIntensity
    );

    // pull out our values…
    const co2Values = Object.values(co2ValuesbyComponent);

    // so we can return their sum
    return co2Values.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    );
  }

  /**
   * Accept a figure for bytes transferred and return a single figure for CO2
   * emissions. This method applies caching assumptions from the original Sustainable Web Design model.
   *
   * @param {number} bytes - the data transferred in bytes
   * @param {number} `carbonIntensity` the carbon intensity for datacentre (average figures, not marginal ones)
   * @return {number} the total number in grams of CO2 equivalent emissions
   */
  perVisit(bytes, carbonIntensity = GLOBAL_INTENSITY) {
    const energyBycomponent = this.energyPerVisitByComponent(bytes);

    // when faced with falsy values, fallback to global intensity
    if (Boolean(carbonIntensity) === false) {
      carbonIntensity = GLOBAL_INTENSITY;
    }
    // if we have a boolean, we have a green result from the green web checker
    // use the renewables intensity
    if (carbonIntensity === true) {
      carbonIntensity = RENEWABLES_INTENSITY;
    }

    // otherwise when faced with non numeric values throw an error
    if (typeof carbonIntensity !== "number") {
      throw new Error(
        `perVisit expects a numeric value or boolean for the carbon intensity value. Received: ${carbonIntensity}`
      );
    }

    const co2ValuesbyComponent = this.co2byComponent(
      energyBycomponent,
      carbonIntensity
    );

    // pull out our values…
    const co2Values = Object.values(co2ValuesbyComponent);

    // so we can return their sum
    return co2Values.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    );
  }

  /**
   * Accept a figure for bytes transferred and return the number of kilowatt hours used
   * by the total system for this data transfer
   *
   * @param {number} bytes
   * @return {number} the number of kilowatt hours used
   */
  energyPerByte(bytes) {
    const energyByComponent = this.energyPerByteByComponent(bytes);

    // pull out our values…
    const energyValues = Object.values(energyByComponent);

    // so we can return their sum
    return energyValues.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    );
  }

  /**
   * Accept a figure for bytes transferred, and return an object containing figures
   * per system component, with the caching assumptions applied. This tries to account
   * for webpages being loaded from a cache by browsers, so if you had a thousand page views,
   * and tried to work out the energy per visit, the numbers would reflect the reduced amounts
   * of transfer.
   *
   * @param {number} bytes - the data transferred in bytes for loading a webpage
   * @param {number} firstView - what percentage of visits are loading this page for the first time
   * @param {number} returnView - what percentage of visits are loading this page for subsequent times
   * @param {number} dataReloadRatio - what percentage of a page is reloaded on each subsequent page view
   *
   * @return {object} Object containing the energy in kilowatt hours, keyed by system component
   */
  energyPerVisitByComponent(
    bytes,
    firstView = FIRST_TIME_VIEWING_PERCENTAGE,
    returnView = RETURNING_VISITOR_PERCENTAGE,
    dataReloadRatio = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
  ) {
    const energyBycomponent = this.energyPerByteByComponent(bytes);
    const cacheAdjustedSegmentEnergy = {};

    log({ energyBycomponent });
    const energyValues = Object.values(energyBycomponent);

    // for this, we want
    for (const [key, value] of Object.entries(energyBycomponent)) {
      // represent the first load
      cacheAdjustedSegmentEnergy[`${key} - first`] = value * firstView;

      // then represent the subsequent load
      cacheAdjustedSegmentEnergy[`${key} - subsequent`] =
        value * returnView * dataReloadRatio;
    }
    log({ cacheAdjustedSegmentEnergy });

    return cacheAdjustedSegmentEnergy;
  }

  /**
   * Accept a figure for bytes, and return the total figure for energy per visit
   * using the default caching assumptions for loading a single website
   *
   * @param {number} bytes
   * @return {number} the total energy use for the visit, after applying the caching assumptions
   */
  energyPerVisit(bytes) {
    // fetch the values using the default caching assumptions
    // const energyValues = Object.values(this.energyPerVisitByComponent(bytes));

    let firstVisits = 0;
    let subsequentVisits = 0;

    const energyBycomponent = Object.entries(
      this.energyPerVisitByComponent(bytes)
    );

    for (const [key, val] of energyBycomponent) {
      if (key.indexOf("first") > 0) {
        firstVisits += val;
      }
    }

    for (const [key, val] of energyBycomponent) {
      if (key.indexOf("subsequent") > 0) {
        subsequentVisits += val;
      }
    }

    return firstVisits + subsequentVisits;
  }

  // TODO: this method looks like it applies the carbon intensity
  // change to the *entire* system, not just the datacenter.
  emissionsPerVisitInGrams(energyPerVisit, carbonintensity = GLOBAL_INTENSITY) {
    return formatNumber(energyPerVisit * carbonintensity);
  }

  annualEnergyInKwh(energyPerVisit, monthlyVisitors = 1000) {
    return energyPerVisit * monthlyVisitors * 12;
  }

  annualEmissionsInGrams(co2grams, monthlyVisitors = 1000) {
    return co2grams * monthlyVisitors * 12;
  }

  annualSegmentEnergy(annualEnergy) {
    return {
      consumerDeviceEnergy: formatNumber(annualEnergy * END_USER_DEVICE_ENERGY),
      networkEnergy: formatNumber(annualEnergy * NETWORK_ENERGY),
      dataCenterEnergy: formatNumber(annualEnergy * DATACENTER_ENERGY),
      productionEnergy: formatNumber(annualEnergy * PRODUCTION_ENERGY),
    };
  }
}

export { SustainableWebDesign };
export default SustainableWebDesign;
