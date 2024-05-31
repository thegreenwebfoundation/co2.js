"use strict";

/**
 * Sustainable Web Design version 4
 *
 * Updated calculations and figures from
 * https://sustainablewebdesign.org/estimating-digital-emissions/
 *
 */

import { fileSize, SWDV4 } from "./constants/index.js";
import { outputRating } from "./helpers/index.js";

const {
  OPERATIONAL_KWH_PER_GB_DATACENTER,
  OPERATIONAL_KWH_PER_GB_NETWORK,
  OPERATIONAL_KWH_PER_GB_DEVICE,
  EMBODIED_KWH_PER_GB_DATACENTER,
  EMBODIED_KWH_PER_GB_NETWORK,
  EMBODIED_KWH_PER_GB_DEVICE,
  GLOBAL_GRID_INTENSITY,
} = SWDV4;

/**
 * Output the CO2e emissions for each system segment
 * @param {object} operationalEmissions
 * @param {object} embodiedEmissions
 * @returns {object}
 */
function outputSegments(operationalEmissions, embodiedEmissions) {
  const totalOperationalCO2e =
    operationalEmissions.dataCenter +
    operationalEmissions.network +
    operationalEmissions.device;
  const totalEmbodiedCO2e =
    embodiedEmissions.dataCenter +
    embodiedEmissions.network +
    embodiedEmissions.device;

  const dataCenterCO2e =
    operationalEmissions.dataCenter + embodiedEmissions.dataCenter;
  const networkCO2e = operationalEmissions.network + embodiedEmissions.network;
  const consumerDeviceCO2e =
    operationalEmissions.device + embodiedEmissions.device;

  return {
    dataCenterOperationalCO2e: operationalEmissions.dataCenter,
    networkOperationalCO2e: operationalEmissions.network,
    consumerDeviceOperationalCO2e: operationalEmissions.device,
    dataCenterEmbodiedCO2e: embodiedEmissions.dataCenter,
    networkEmbodiedCO2e: embodiedEmissions.network,
    consumerDeviceEmbodiedCO2e: embodiedEmissions.device,
    totalEmbodiedCO2e,
    totalOperationalCO2e,
    dataCenterCO2e,
    networkCO2e,
    consumerDeviceCO2e,
  };
}

class SustainableWebDesign {
  constructor(options) {
    this.allowRatings = true;
    this.options = options;
    this.version = 4;
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

  // NOTE: Setting green: true should result in a GREEN_HOSTING_FACTOR of 1.0
  perByte(
    bytes,
    green = false,
    segmented = false,
    ratingResults = false,
    options = {}
  ) {
    if (bytes < 1) {
      return 0;
    }

    const operationalEmissions = this.operationalEmissions(bytes, options);
    const embodiedEmissions = this.embodiedEmissions(bytes);
    let GREEN_HOSTING_FACTOR = 0;

    if (green) {
      GREEN_HOSTING_FACTOR = 1.0;
    } else if (
      options?.greenHostingFactor ||
      options?.greenHostingFactor === 0
    ) {
      GREEN_HOSTING_FACTOR = options.greenHostingFactor;
    }

    const totalEmissions = {
      dataCenter:
        operationalEmissions.dataCenter * (1 - GREEN_HOSTING_FACTOR) +
        embodiedEmissions.dataCenter,
      network: operationalEmissions.network + embodiedEmissions.network,
      device: operationalEmissions.device + embodiedEmissions.device,
    };

    const total =
      totalEmissions.dataCenter +
      totalEmissions.network +
      totalEmissions.device;

    let rating = null;
    if (ratingResults) {
      rating = this.ratingScale(total);
    }

    if (segmented) {
      const segments = {
        ...outputSegments(operationalEmissions, embodiedEmissions),
      };

      if (ratingResults) {
        return {
          ...segments,
          total,
          rating,
        };
      }
      return { ...segments, total };
    }

    if (ratingResults) {
      return { total, rating };
    }

    return total;
  }

  perVisit(
    bytes,
    green = false,
    segmented = false,
    ratingResults = false,
    options = {}
  ) {
    let firstViewRatio = 1;
    let returnViewRatio = 0;
    let dataReloadRatio = 0;
    let GREEN_HOSTING_FACTOR = 0;
    const operationalEmissions = this.operationalEmissions(bytes, options);
    const embodiedEmissions = this.embodiedEmissions(bytes);

    if (bytes < 1) {
      return 0;
    }

    if (green) {
      GREEN_HOSTING_FACTOR = 1.0;
    } else if (
      options?.greenHostingFactor ||
      options?.greenHostingFactor === 0
    ) {
      GREEN_HOSTING_FACTOR = options.greenHostingFactor;
    }

    if (options.firstVisitPercentage || options.firstVisitPercentage === 0) {
      firstViewRatio = options.firstVisitPercentage;
    }

    if (options.returnVisitPercentage || options.returnVisitPercentage === 0) {
      returnViewRatio = options.returnVisitPercentage;
    }

    if (options.dataReloadRatio || options.dataReloadRatio === 0) {
      dataReloadRatio = options.dataReloadRatio;
    }

    // NOTE: First visit emissions are calculated as the sum of all three segments without any caching.

    const firstVisitEmissions =
      operationalEmissions.dataCenter * (1 - GREEN_HOSTING_FACTOR) +
      embodiedEmissions.dataCenter +
      operationalEmissions.network +
      embodiedEmissions.network +
      operationalEmissions.device +
      embodiedEmissions.device;

    // NOTE: First visit emissions are calculated as the sum of all three segments with caching applied.

    const returnVisitEmissions =
      (operationalEmissions.dataCenter * (1 - GREEN_HOSTING_FACTOR) +
        embodiedEmissions.dataCenter +
        operationalEmissions.network +
        embodiedEmissions.network +
        operationalEmissions.device +
        embodiedEmissions.device) *
      (1 - dataReloadRatio);

    // NOTE: The total emissions account for the percentage of first and return visits.
    const total =
      firstVisitEmissions * firstViewRatio +
      returnVisitEmissions * returnViewRatio;

    let rating = null;
    if (ratingResults) {
      rating = this.ratingScale(total);
    }

    if (segmented) {
      const segments = {
        ...outputSegments(operationalEmissions, embodiedEmissions),
        firstVisitCO2e: firstVisitEmissions,
        returnVisitCO2e: returnVisitEmissions,
      };

      if (ratingResults) {
        return {
          ...segments,
          total,
          rating,
        };
      }

      return { ...segments, total };
    }

    if (ratingResults) {
      return { total, rating };
    }

    return total;
  }

  /**
   * Determines the rating of a website's sustainability based on its CO2 emissions.
   *
   * @param {number} co2e - The CO2 emissions of the website in grams.
   * @returns {string} The sustainability rating, ranging from "A+" (best) to "F" (worst).
   */
  ratingScale(co2e) {
    return outputRating(co2e, this.version);
  }
}

export { SustainableWebDesign };
export default SustainableWebDesign;
