"use strict";

/**
 * Sustainable Web Design version 4
 *
 * Updated calculations and figures from
 * https://sustainablewebdesign.org/estimating-digital-emissions/
 *
 */

import { fileSize, SWDV4 } from "./constants/index.js";
import { formatNumber } from "./helpers/index.js";

const {
  OPERATIONAL_KWH_PER_GB_DATACENTER,
  OPERATIONAL_KWH_PER_GB_NETWORK,
  OPERATIONAL_KWH_PER_GB_DEVICE,
  EMBODIED_KWH_PER_GB_DATACENTER,
  EMBODIED_KWH_PER_GB_NETWORK,
  EMBODIED_KWH_PER_GB_DEVICE,
  GLOBAL_GRID_INTENSITY,
} = SWDV4;

class SustainableWebDesign {
  constructor(options) {
    this.options = options;
  }

  /**
   * Calculate the operational energy of data transfer for each system segment
   *
   * @param {number} bytes
   * @returns {object}
   */
  operationalEnergyPerSegment(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const dataCenter = transferedBytesToGb * OPERATIONAL_KWH_PER_GB_DATACENTER;
    const network = transferedBytesToGb * OPERATIONAL_KWH_PER_GB_NETWORK;
    const device = transferedBytesToGb * OPERATIONAL_KWH_PER_GB_DEVICE;

    return {
      dataCenter,
      network,
      device,
    };
  }

  /**
   * Calculate the operational emissions of data transfer for each system segment
   *
   * @param {number} bytes
   * @param {object} options
   * @returns {object}
   */
  operationalEmissions(bytes, options = {}) {
    const { dataCenter, network, device } =
      this.operationalEnergyPerSegment(bytes);

    let dataCenterGridIntensity = GLOBAL_GRID_INTENSITY;
    let networkGridIntensity = GLOBAL_GRID_INTENSITY;
    let deviceGridIntensity = GLOBAL_GRID_INTENSITY;

    if (options?.gridIntensity) {
      const { device, network, dataCenter } = options.gridIntensity;

      if (device?.value || device?.value === 0) {
        deviceGridIntensity = device.value;
      }

      if (network?.value || network?.value === 0) {
        networkGridIntensity = network.value;
      }

      if (dataCenter?.value || dataCenter?.value === 0) {
        dataCenterGridIntensity = dataCenter.value;
      }
    }

    const dataCenterEmissions = dataCenter * dataCenterGridIntensity;
    const networkEmissions = network * networkGridIntensity;
    const deviceEmissions = device * deviceGridIntensity;

    return {
      dataCenter: dataCenterEmissions,
      network: networkEmissions,
      device: deviceEmissions,
    };
  }

  /**
   * Calculate the embodied energy of data transfer for each system segment
   *
   * @param {number} bytes
   * @returns {object}
   */
  embodiedEnergyPerSegment(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const dataCenter = transferedBytesToGb * EMBODIED_KWH_PER_GB_DATACENTER;
    const network = transferedBytesToGb * EMBODIED_KWH_PER_GB_NETWORK;
    const device = transferedBytesToGb * EMBODIED_KWH_PER_GB_DEVICE;

    return {
      dataCenter,
      network,
      device,
    };
  }

  /**
   * Calculate the embodied emissions of data transfer for each system segment
   *
   * @param {number} bytes
   * @returns {object}
   */
  embodiedEmissions(bytes) {
    const { dataCenter, network, device } =
      this.embodiedEnergyPerSegment(bytes);

    const dataCenterGridIntensity = GLOBAL_GRID_INTENSITY;
    const networkGridIntensity = GLOBAL_GRID_INTENSITY;
    const deviceGridIntensity = GLOBAL_GRID_INTENSITY;

    // NOTE: Per the guidance in the SWDM v4, the grid intensity values for embodied emissions are fixed to the global grid intensity.

    const dataCenterEmissions = dataCenter * dataCenterGridIntensity;
    const networkEmissions = network * networkGridIntensity;
    const deviceEmissions = device * deviceGridIntensity;

    return {
      dataCenter: dataCenterEmissions,
      network: networkEmissions,
      device: deviceEmissions,
    };
  }
}

export { SustainableWebDesign };
export default SustainableWebDesign;
