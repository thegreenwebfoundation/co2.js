"use strict";

/**
 * Sustainable Web Design
 *
 * Updated calculations and figures from
 * https://sustainablewebdesign.org/calculating-digital-emissions/
 *
 */

import {
  fileSize,
  KWH_PER_GB,
  END_USER_DEVICE_ENERGY,
  NETWORK_ENERGY,
  DATACENTER_ENERGY,
  PRODUCTION_ENERGY,
  GLOBAL_GRID_INTENSITY,
  RENEWABLES_GRID_INTENSITY,
  FIRST_TIME_VIEWING_PERCENTAGE,
  RETURNING_VISITOR_PERCENTAGE,
  PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD,
} from "./constants/index.js";
import { formatNumber } from "./helpers/index.js";

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
   * @param {object} energyByComponent - energy grouped by the four system components
   * @param {number} [carbonIntensity] - carbon intensity to apply to the datacentre values
   * @return {number} the total number in grams of CO2 equivalent emissions
   */
  co2byComponent(
    energyByComponent,
    carbonIntensity = GLOBAL_GRID_INTENSITY,
    options = {}
  ) {
    let deviceCarbonIntensity = GLOBAL_GRID_INTENSITY;
    let networkCarbonIntensity = GLOBAL_GRID_INTENSITY;
    let dataCenterCarbonIntensity = GLOBAL_GRID_INTENSITY;

    let globalEmissions = GLOBAL_GRID_INTENSITY;

    if (options?.gridIntensity) {
      const { device, network, dataCenter } = options.gridIntensity;

      if (device?.value) {
        deviceCarbonIntensity = device.value;
      }
      if (network?.value) {
        networkCarbonIntensity = network.value;
      }
      // If the user has set a carbon intensity value for the datacentre, then that overrides everything and is used
      if (dataCenter?.value) {
        dataCenterCarbonIntensity = dataCenter.value;
      }
    }

    // If the user passes in a TRUE value (green web host), then use the renewables intensity value
    if (carbonIntensity === true) {
      dataCenterCarbonIntensity = RENEWABLES_GRID_INTENSITY;
    }

    const returnCO2ByComponent = {};
    for (const [key, value] of Object.entries(energyByComponent)) {
      // we update the datacentre, as that's what we have information
      // about.
      if (key.startsWith("dataCenterEnergy")) {
        returnCO2ByComponent[key.replace("Energy", "CO2")] =
          value * dataCenterCarbonIntensity;
      } else if (key.startsWith("consumerDeviceEnergy")) {
        returnCO2ByComponent[key.replace("Energy", "CO2")] =
          value * deviceCarbonIntensity;
      } else if (key.startsWith("networkEnergy")) {
        returnCO2ByComponent[key.replace("Energy", "CO2")] =
          value * networkCarbonIntensity;
      } else {
        // Use the global intensity for the remaining segments
        returnCO2ByComponent[key.replace("Energy", "CO2")] =
          value * globalEmissions;
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
  perByte(
    bytes,
    carbonIntensity = false,
    segmentResults = false,
    options = {}
  ) {
    const energyBycomponent = this.energyPerByteByComponent(bytes, options);

    // otherwise when faced with non numeric values throw an error
    if (typeof carbonIntensity !== "boolean") {
      throw new Error(
        `perByte expects a boolean for the carbon intensity value. Received: ${carbonIntensity}`
      );
    }

    const co2ValuesbyComponent = this.co2byComponent(
      energyBycomponent,
      carbonIntensity,
      options
    );

    // pull out our values…
    const co2Values = Object.values(co2ValuesbyComponent);
    const co2ValuesSum = co2Values.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    );

    if (segmentResults) {
      return { ...co2ValuesbyComponent, total: co2ValuesSum };
    }

    return co2ValuesSum;
  }

  /**
   * Accept a figure for bytes transferred and return a single figure for CO2
   * emissions. This method applies caching assumptions from the original Sustainable Web Design model.
   *
   * @param {number} bytes - the data transferred in bytes
   * @param {number} `carbonIntensity` the carbon intensity for datacentre (average figures, not marginal ones)
   * @return {number} the total number in grams of CO2 equivalent emissions
   */
  perVisit(
    bytes,
    carbonIntensity = false,
    segmentResults = false,
    options = {}
  ) {
    const energyBycomponent = this.energyPerVisitByComponent(bytes, options);

    if (typeof carbonIntensity !== "boolean") {
      // otherwise when faced with non numeric values throw an error
      throw new Error(
        `perVisit expects a boolean for the carbon intensity value. Received: ${carbonIntensity}`
      );
    }

    const co2ValuesbyComponent = this.co2byComponent(
      energyBycomponent,
      carbonIntensity,
      options
    );

    // pull out our values…
    const co2Values = Object.values(co2ValuesbyComponent);
    const co2ValuesSum = co2Values.reduce(
      (prevValue, currentValue) => prevValue + currentValue
    );

    if (segmentResults) {
      return { ...co2ValuesbyComponent, total: co2ValuesSum };
    }

    // so we can return their sum
    return co2ValuesSum;
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
    options = {},
    firstView = FIRST_TIME_VIEWING_PERCENTAGE,
    returnView = RETURNING_VISITOR_PERCENTAGE,
    dataReloadRatio = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
  ) {
    if (options.dataReloadRatio) {
      dataReloadRatio = options.dataReloadRatio;
    }

    if (options.firstVisitPercentage) {
      firstView = options.firstVisitPercentage;
    }

    if (options.returnVisitPercentage) {
      returnView = options.returnVisitPercentage;
    }

    const energyBycomponent = this.energyPerByteByComponent(bytes);
    const cacheAdjustedSegmentEnergy = {};

    const energyValues = Object.values(energyBycomponent);

    // for this, we want
    for (const [key, value] of Object.entries(energyBycomponent)) {
      // represent the first load
      cacheAdjustedSegmentEnergy[`${key} - first`] = value * firstView;

      // then represent the subsequent load
      cacheAdjustedSegmentEnergy[`${key} - subsequent`] =
        value * returnView * dataReloadRatio;
    }

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

  emissionsPerVisitInGrams(
    energyPerVisit,
    carbonintensity = GLOBAL_GRID_INTENSITY
  ) {
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
