import { averageIntensity } from "../index.js";
import {
  GLOBAL_GRID_INTENSITY,
  PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD,
  FIRST_TIME_VIEWING_PERCENTAGE,
  RETURNING_VISITOR_PERCENTAGE,
} from "../constants/index.js";
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
    if (device || device === 0) {
      if (typeof device === "object") {
        if (!averageIntensity.data[device.country?.toUpperCase()]) {
          console.warn(
            `"${device.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information. \nFalling back to global average grid intensity.`
          );
          adjustments.gridIntensity["device"] = {
            value: GLOBAL_GRID_INTENSITY,
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
        adjustments.gridIntensity["device"] = {
          value: GLOBAL_GRID_INTENSITY,
        };
        console.warn(
          `The device grid intensity must be a number or an object. You passed in a ${typeof device}. \nFalling back to global average grid intensity.`
        );
      }
    }
    if (dataCenter || dataCenter === 0) {
      if (typeof dataCenter === "object") {
        if (!averageIntensity.data[dataCenter.country?.toUpperCase()]) {
          console.warn(
            `"${dataCenter.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  \nFalling back to global average grid intensity.`
          );
          adjustments.gridIntensity["dataCenter"] = {
            value: GLOBAL_GRID_INTENSITY,
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
        adjustments.gridIntensity["dataCenter"] = {
          value: GLOBAL_GRID_INTENSITY,
        };
        console.warn(
          `The data center grid intensity must be a number or an object. You passed in a ${typeof dataCenter}. \nFalling back to global average grid intensity.`
        );
      }
    }
    if (network || network === 0) {
      if (typeof network === "object") {
        if (!averageIntensity.data[network.country?.toUpperCase()]) {
          console.warn(
            `"${network.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. \nSee https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  Falling back to global average grid intensity. \nFalling back to global average grid intensity.`
          );
          adjustments.gridIntensity["network"] = {
            value: GLOBAL_GRID_INTENSITY,
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
        adjustments.gridIntensity["network"] = {
          value: GLOBAL_GRID_INTENSITY,
        };
        console.warn(
          `The network grid intensity must be a number or an object. You passed in a ${typeof network}. \nFalling back to global average grid intensity.`
        );
      }
    }
  }

  if (options?.dataReloadRatio || options.dataReloadRatio === 0) {
    if (typeof options.dataReloadRatio === "number") {
      if (options.dataReloadRatio >= 0 && options.dataReloadRatio <= 1) {
        adjustments.dataReloadRatio = options.dataReloadRatio;
      } else {
        adjustments.dataReloadRatio =
          PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD;
        console.warn(
          `The dataReloadRatio option must be a number between 0 and 1. You passed in ${options.dataReloadRatio}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.dataReloadRatio =
        PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD;
      console.warn(
        `The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}. \nFalling back to default value.`
      );
    }
  }

  if (options?.firstVisitPercentage || options.firstVisitPercentage === 0) {
    if (typeof options.firstVisitPercentage === "number") {
      if (
        options.firstVisitPercentage >= 0 &&
        options.firstVisitPercentage <= 1
      ) {
        adjustments.firstVisitPercentage = options.firstVisitPercentage;
      } else {
        adjustments.firstVisitPercentage = FIRST_TIME_VIEWING_PERCENTAGE;
        console.warn(
          `The firstVisitPercentage option must be a number between 0 and 1. You passed in ${options.firstVisitPercentage}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.firstVisitPercentage = FIRST_TIME_VIEWING_PERCENTAGE;
      console.warn(
        `The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}. \nFalling back to default value.`
      );
    }
  }

  if (options?.returnVisitPercentage || options.returnVisitPercentage === 0) {
    if (typeof options.returnVisitPercentage === "number") {
      if (
        options.returnVisitPercentage >= 0 &&
        options.returnVisitPercentage <= 1
      ) {
        adjustments.returnVisitPercentage = options.returnVisitPercentage;
      } else {
        adjustments.returnVisitPercentage = RETURNING_VISITOR_PERCENTAGE;
        console.warn(
          `The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}. \nFalling back to default value.`
        );
      }
    } else {
      adjustments.returnVisitPercentage = RETURNING_VISITOR_PERCENTAGE;
      console.warn(
        `The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. \nFalling back to default value.`
      );
    }
  }

  return adjustments;
}

export { formatNumber, parseOptions };
