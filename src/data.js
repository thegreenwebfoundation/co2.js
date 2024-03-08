"use strict";
import ElectricityMapsApi from "./data/external/electricityMapsApi.js";

class DataSources {
  constructor() {
    /**
     *  @type {String} - The source of the data.
     */
    this.source = undefined;
  }

  /**
   * Set the source of the data.
   * @param {string} source - The source of the data.
   * @throws {Error} Will throw an error if the source is unknown or not provided.
   */
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
