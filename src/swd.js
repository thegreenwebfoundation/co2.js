'use strict';

const { fileSize } = require('./constants');
const { formatNumber } = require('./helpers');

const KWH_PER_GB = 0.81;
const GLOABL_INTENSITY = 475;
const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;

class SWD {
  constructor(options) {
    this.options = options;
  }

  energyPerVisit(
    bytes,
    kWhPerGb = KWH_PER_GB,
    returningVisitorPercentage = RETURNING_VISITOR_PERCENTAGE,
    firstTimeVisitorPercentage = FIRST_TIME_VIEWING_PERCENTAGE,
    subsiquentLoadPercentage = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
  ) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;

    return (
      transferedBytesToGb * kWhPerGb * returningVisitorPercentage +
      transferedBytesToGb *
        kWhPerGb *
        firstTimeVisitorPercentage *
        subsiquentLoadPercentage
    );
  }

  emissionsPerVisitInGrams(energyPerVisit, globalIntensity = GLOABL_INTENSITY) {
    return formatNumber(energyPerVisit * globalIntensity);
  }

  annualEnergyInKwh(energyPerVisit, monthlyVisitors = 1000) {
    return energyPerVisit * monthlyVisitors * 12;
  }

  annualEmissionsInGrams(co2grams, monthlyVisitors = 1000) {
    return co2grams * monthlyVisitors * 12;
  }

  annualSegmentEngergy(annualEnergy) {
    return {
      consumerDeviceEnergy: formatNumber(annualEnergy * 0.52),
      networkEnergy: formatNumber(annualEnergy * 0.14),
      dataCenterEnergy: formatNumber(annualEnergy * 0.15),
      productionEnergy: formatNumber(annualEnergy * 0.19),
    };
  }
}

module.exports = SWD;
