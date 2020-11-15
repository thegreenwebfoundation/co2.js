// Use the 1byte model for now from the Shift Project, and assume a US grid mix figure they use of around 519 g co2 for the time being. It's lower for Europe, and in particular, France, but for v1, we don't include this
const CO2_PER_KWH_IN_DC_GREY = 519;

// the 1 byte model gives figures for energy usage for:

// datacentres
// networks
// the device used to access a site/app

// The device usage figure combines figures for:
//  1. the usage for devices (which is small proportion of the energy use)
//  2. the *making* the device, which is comparatively high.

const KWH_PER_BYTE_IN_DC = 0.00000000072;

// this is probably best left as something users can define, or
// a weighted average based on total usage.
// Pull requests gratefully accepted
const KWH_PER_BYTE_FOR_NETWORK = 0.00000000488;

const KWH_PER_BYTE_FOR_DEVICES = 0.00000000013;
export {
  KWH_PER_BYTE_IN_DC,
  KWH_PER_BYTE_FOR_NETWORK,
  KWH_PER_BYTE_FOR_DEVICES,
  CO2_PER_KWH_IN_DC_GREY
};
