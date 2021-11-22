// PLEASE DO NOT USE THIS MODEL YET FOR CALCS

const CO2_PER_KWH_IN_DC_GREY = 519;

// this subs in the IEA's recent figure in analyis from the carbon brief
// https://www.carbonbrief.org/factcheck-what-is-the-carbon-footprint-of-streaming-video-on-netflix

// datacentres
const KWH_PER_BYTE_IN_DC = 0.00000000007;

// networks
const KWH_PER_BYTE_FOR_NETWORK = 0.00000000058;

// the device used to access a site/app
const KWH_PER_BYTE_FOR_DEVICES = 0.00000000055;

// The device usage figure combines figures for:
//  1. the usage for devices (which is small proportion of the energy use)
//  2. the *making* the device, which is comparitively high.

module.exports = {
  KWH_PER_BYTE_IN_DC,
  KWH_PER_BYTE_FOR_NETWORK,
  KWH_PER_BYTE_FOR_DEVICES,
  CO2_PER_KWH_IN_DC_GREY,
};
