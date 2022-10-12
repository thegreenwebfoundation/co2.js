// Use the 1byte model for now from the Shift Project, and assume a US grid mix figure they use of around 519 g co2 for the time being. It's lower for Europe, and in particular, France, but for v1, we don't include this
const CO2_PER_KWH_IN_DC_GREY = 519;

// this figure is from the IEA's 2018 report for a global average:
const CO2_PER_KWH_NETWORK_GREY = 475;

// TODO - these figures need to be updated, as the figures for green
// shouldn't really be zero now we know that carbon intensity figures
// for renewables still usually include the life cycle emissions
const CO2_PER_KWH_IN_DC_GREEN = 0;

// the 1 byte model gives figures for energy usage for:

// datacentres
// networks
// the device used to access a site/app

// The device usage figure combines figures for:
//  1. the usage for devices (which is small proportion of the energy use)
//  2. the *making* the device, which is comparatively high.

const KWH_PER_BYTE_IN_DC = 7.2e-11;

// this is probably best left as something users can define, or
// a weighted average based on total usage.
// Using a simple mean for now, as while web traffic to end users might trend
// towards wifi and mobile,
// Web traffic between servers is likely wired networks

const FIXED_NETWORK_WIRED = 4.29e-10;
const FIXED_NETWORK_WIFI = 1.52e-10;
const FOUR_G_MOBILE = 8.84e-10;

// Pull requests gratefully accepted
const KWH_PER_BYTE_FOR_NETWORK =
  (FIXED_NETWORK_WIRED + FIXED_NETWORK_WIFI + FOUR_G_MOBILE) / 3;

const KWH_PER_BYTE_FOR_DEVICES = 1.3e-10;

class OneByte {
  constructor(options) {
    this.options = options;

    this.KWH_PER_BYTE_FOR_NETWORK = KWH_PER_BYTE_FOR_NETWORK;
  }

  perByte(bytes, green) {
    if (bytes < 1) {
      return 0;
    }

    if (green) {
      // if we have a green datacentre, use the lower figure for renewable energy
      const Co2ForDC = bytes * KWH_PER_BYTE_IN_DC * CO2_PER_KWH_IN_DC_GREEN;

      // but for the worest of the internet, we can't easily check, so assume
      // grey for now
      const Co2forNetwork =
        bytes * KWH_PER_BYTE_FOR_NETWORK * CO2_PER_KWH_NETWORK_GREY;

      return Co2ForDC + Co2forNetwork;
    }

    const KwHPerByte = KWH_PER_BYTE_IN_DC + KWH_PER_BYTE_FOR_NETWORK;
    return bytes * KwHPerByte * CO2_PER_KWH_IN_DC_GREY;
  }
}

export { OneByte };
export default OneByte;
