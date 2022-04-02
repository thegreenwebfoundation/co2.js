"use strict";

/**
 * Sustainable Web Design
 *
 * Updated calculations and figures from
 * https://sustainablewebdesign.org/calculating-digital-emissions/
 *
 *
 */
const { fileSize } = require("./constants");
const { formatNumber } = require("./helpers");

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

const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
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
    }
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
    const co2byComponent = {}
    for (const [key, value] of Object.entries(energyBycomponent)) {
      // we update the datacentre, as that's what we have information
      // about.
      if (key === 'dataCenterEnergy') {
        co2byComponent[key] = value * carbonIntensity
      } else {
        // We don't have info about the device location,
        // nor the network path used, nor the production emissions
        // so we revert to global figures
        co2byComponent[key] = value * GLOBAL_INTENSITY
      }
    }
    return co2byComponent
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
    const energyBycomponent = this.energyPerByteByComponent(bytes)

    const co2byComponent = {}
    for (const [key, value] of Object.entries(energyBycomponent)) {
      // we update the datacentre, as that's what we have information
      // about.
      if (key === 'dataCenterEnergy') {
        co2byComponent[key] = value * carbonIntensity
      } else {
        // We don't have info about the device location,
        // nor the network path used, nor the production emissions
        // so we revert to global figures
        co2byComponent[key] = value * GLOBAL_INTENSITY
      }
    }

    // pull out our values…
    const co2Values = Object.values(co2byComponent)

    // so we can return their sum
    return co2Values.reduce((prevValue, currentValue) => prevValue + currentValue)
  }


  /**
   * Accept a figure for bytes transferred and return the number of kilowatt hours used
   * by the total system for this data transfer
   *
   * @param {number} bytes
   * @return {number} the number of kilowatt hours used
   */
  energyPerByte(bytes) {
    const energyByComponent = this.energyPerByteByComponent(bytes)

    // pull out our values…
    const energyValues = Object.values(energyByComponent)

    // so we can return their sum
    return energyValues.reduce((prevValue, currentValue) => prevValue + currentValue)
  }

  /**
   * Accept a figure for bytes transferred, and return an object containing figures
   * per system component, with the caching assumptions applied
   *
   * @param {number} bytes - the data transferred in bytes
   * @return {object} Object containing the energy in kilowatt hours, keyed by system component
   */
  energyPerVisitByComponent(bytes,
    firstView = FIRST_TIME_VIEWING_PERCENTAGE,
    returnView = RETURNING_VISITOR_PERCENTAGE,
    dataReloadRatio = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD) {

    const energyBycomponent = this.energyPerByteByComponent(bytes)
    const cacheAdjustedSegmentEnergy = {}

    for (const [key, value] of Object.entries(energyBycomponent)) {
      // represent the first load
      cacheAdjustedSegmentEnergy[key] = value * firstView

      // then represent the subsequent load
      cacheAdjustedSegmentEnergy[key] += value * returnView * dataReloadRatio
    }

    return cacheAdjustedSegmentEnergy
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
    const energyValues = Object.values(this.energyPerVisitByComponent(bytes))

    // return the summed of the values to return our single number
    return energyValues.reduce((prevValue, currentValue) => prevValue + currentValue)
  }

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

module.exports = SustainableWebDesign;
