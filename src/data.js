"use strict";
import ElectricityMapsApi from "./data/external/electricityMapsApi.js";

class DataSources {
  constructor() {
    this.source = undefined;
    this.get = undefined;
  }

  set(source) {
    switch (source) {
      case "electricityMapsApi":
        this.source = new ElectricityMapsApi();
        this.get = this.source.get;
        break;
      default:
        throw new Error(`Unknown data source: ${source}`);
    }
  }
}
export { DataSources };
export default DataSources;
