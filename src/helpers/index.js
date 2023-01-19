import { averageIntensity } from "../index.js";
const formatNumber = (num) => parseFloat(num.toFixed(2));

function parseOptions(options) {
  // CHeck that it is an object
  if (typeof options !== "object") {
    throw new Error("Options must be an object");
  }

  const adjustments = {};

  if (options?.gridIntensity) {
    adjustments.gridIntensity = {};
    const { device, dataCenter, network } = options.gridIntensity;
    if (device) {
      if (typeof device === "object") {
        if (!averageIntensity.data[device.country?.toUpperCase()]) {
          console.warn(
            `"${device.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information. Falling back to global average grid intensity.`
          );
          adjustments.gridIntensity["device"] = {
            value: 442,
          };
        }
        adjustments.gridIntensity["device"] = {
          country: device.country,
          value: parseFloat(
            averageIntensity.data[device.country?.toUpperCase()]
          ),
        };
      } else if (typeof device === "number") {
        adjustments.gridIntensity["device"] = {
          value: device,
        };
      } else {
        throw new Error(
          `The device grid intensity must be a number or an object. You passed in a ${typeof device}.`
        );
      }
    }
    if (dataCenter) {
      if (typeof dataCenter === "object") {
        if (!averageIntensity.data[dataCenter.country?.toUpperCase()]) {
          console.warn(
            `"${dataCenter.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  Falling back to global average grid intensity.`
          );
          adjustments.gridIntensity["dataCenter"] = {
            value: 442,
          };
        }
        adjustments.gridIntensity["dataCenter"] = {
          country: dataCenter.country,
          value: parseFloat(
            averageIntensity.data[dataCenter.country?.toUpperCase()]
          ),
        };
      } else if (typeof dataCenter === "number") {
        adjustments.gridIntensity["dataCenter"] = {
          value: dataCenter,
        };
      } else {
        throw new Error(
          `The data center grid intensity must be a number or an object. You passed in a ${typeof dataCenter}.`
        );
      }
    }
    if (network) {
      if (typeof network === "object") {
        if (!averageIntensity.data[network.country?.toUpperCase()]) {
          console.warn(
            `"${network.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  Falling back to global average grid intensity.`
          );
          adjustments.gridIntensity["network"] = {
            value: 442,
          };
        }
        adjustments.gridIntensity["network"] = {
          country: network.country,
          value: parseFloat(
            averageIntensity.data[network.country?.toUpperCase()]
          ),
        };
      } else if (typeof network === "number") {
        adjustments.gridIntensity["network"] = {
          value: network,
        };
      } else {
        throw new Error(
          `The network grid intensity must be a number or an object. You passed in a ${typeof network}.`
        );
      }
    }
  }

  if (options?.dataReloadRatio) {
    if (typeof options.dataReloadRatio === "number") {
      if (options.dataReloadRatio > 0 && options.dataReloadRatio < 1) {
        adjustments.dataReloadRatio = options.dataReloadRatio;
      } else {
        throw new Error(
          `The dataReloadRatio option must be a number between 0 and 1. You passed in ${options.dataReloadRatio}.`
        );
      }
    } else {
      throw new Error(
        `The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}.`
      );
    }
  }

  if (options?.firstVisitPercentage) {
    if (typeof options.firstVisitPercentage === "number") {
      if (
        options.firstVisitPercentage > 0 &&
        options.firstVisitPercentage < 1
      ) {
        adjustments.firstVisitPercentage = options.firstVisitPercentage;
      } else {
        throw new Error(
          `The firstVisitPercentage option must be a number between 0 and 1. You passed in ${options.firstVisitPercentage}.`
        );
      }
    } else {
      throw new Error(
        `The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}.`
      );
    }
  }

  if (options?.returnVisitPercentage) {
    if (typeof options.returnVisitPercentage === "number") {
      if (
        options.returnVisitPercentage > 0 &&
        options.returnVisitPercentage < 1
      ) {
        adjustments.returnVisitPercentage = options.returnVisitPercentage;
      } else {
        throw new Error(
          `The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}.`
        );
      }
    } else {
      throw new Error(
        `The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}.`
      );
    }
  }

  return adjustments;
}

export { formatNumber, parseOptions };
