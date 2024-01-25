"use strict";
import ElectricityMapsApi from "./data/external/electricityMapsApi.js";

class DataSources {
  constructor() {
    this.source = undefined;
  }

  set(source) {
    switch (source) {
      case "electricityMapsApi":
        this.source = new ElectricityMapsApi();
        break;
      default:
        throw new Error(`Unknown data source: ${source}`);
    }
  }
}
export { DataSources };
export default DataSources;
