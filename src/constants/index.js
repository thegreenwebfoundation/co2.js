import fileSize from "./file-size.js";
import averageIntensity from "../data/average-intensities.min.js";

// SUSTAINABLE WEB DESIGN CONSTANTS
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
// - Global carbon intensity for 2023
const GLOBAL_GRID_INTENSITY = averageIntensity.data["WORLD"];
const RENEWABLES_GRID_INTENSITY = 50;

// Taken from: https://gitlab.com/wholegrain/carbon-api-2-0/-/blob/master/includes/carbonapi.php

const FIRST_TIME_VIEWING_PERCENTAGE = 0.75;
const RETURNING_VISITOR_PERCENTAGE = 0.25;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;

const SWDV4 = {
  OPERATIONAL_KWH_PER_GB_DATACENTER: 0.055,
  OPERATIONAL_KWH_PER_GB_NETWORK: 0.059,
  OPERATIONAL_KWH_PER_GB_DEVICE: 0.08,
  EMBODIED_KWH_PER_GB_DATACENTER: 0.012,
  EMBODIED_KWH_PER_GB_NETWORK: 0.013,
  EMBODIED_KWH_PER_GB_DEVICE: 0.081,
  GLOBAL_GRID_INTENSITY: 494,
};

const SWDMV3_RATINGS = {
  FIFTH_PERCENTILE: 0.095,
  TENTH_PERCENTILE: 0.186,
  TWENTIETH_PERCENTILE: 0.341,
  THIRTIETH_PERCENTILE: 0.493,
  FORTIETH_PERCENTILE: 0.656,
  FIFTIETH_PERCENTILE: 0.846,
};

const SWDMV4_RATINGS = {
  FIFTH_PERCENTILE: 0.04,
  TENTH_PERCENTILE: 0.079,
  TWENTIETH_PERCENTILE: 0.145,
  THIRTIETH_PERCENTILE: 0.209,
  FORTIETH_PERCENTILE: 0.278,
  FIFTIETH_PERCENTILE: 0.359,
};

export {
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
  SWDV4,
  SWDMV3_RATINGS,
  SWDMV4_RATINGS,
};
