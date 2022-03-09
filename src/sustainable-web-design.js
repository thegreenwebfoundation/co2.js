'use strict';

/**
 * Sustainable Web Design
 *
 * Newly update calculations and figures from
 * https://sustainablewebdesign.org/calculating-digital-emissions/
 *
 *
 */
const { fileSize } = require('./constants');
const { formatNumber } = require('./helpers');

// Taken from: https://sustainablewebdesign.org/calculating-digital-emissions/#:~:text=TWh/EB%20or-,0.81%20kWH/GB,-Carbon%20factor%20(global
const KWH_PER_GB = 0.81;
// Taken from: https://www.iea.org/reports/renewables-2021
const GLOBAL_INTENSITY = 440;
// Taken from: https://gitlab.com/wholegrain/carbon-api-2-0/-/blob/master/includes/carbonapi.php
const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;
// Taken from: https://sustainablewebdesign.org/calculating-digital-emissions/#:~:text=Consumer%20device%20energy%20%3D%20AE%20x%200.52
const END_USER_DEVICE_ENERGY = 0.52;

class SustainableWebDesign {
  constructor(options) {
    this.options = options;
  }

  energyPerVisit(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;

    const newVisitorEnergy =
      transferedBytesToGb * KWH_PER_GB * FIRST_TIME_VIEWING_PERCENTAGE;
    const returningVisitorEnergy =
      transferedBytesToGb *
      KWH_PER_GB *
      RETURNING_VISITOR_PERCENTAGE *
      PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD;

    return newVisitorEnergy + returningVisitorEnergy;
  }

  emissionsPerVisitInGrams(energyPerVisit, globalIntensity = GLOBAL_INTENSITY) {
    return formatNumber(energyPerVisit * globalIntensity);
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
      networkEnergy: formatNumber(annualEnergy * 0.14),
      dataCenterEnergy: formatNumber(annualEnergy * 0.15),
      productionEnergy: formatNumber(annualEnergy * 0.19),
    };
  }
}

module.exports = SustainableWebDesign;
