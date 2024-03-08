"use strict";

import DataSources from "./data.js";

describe("DataSources", () => {
  let dataSources;
  describe("sets the source", () => {
    beforeEach(() => {
      dataSources = new DataSources();
    });
    it("throws an error when the data source is not defined", () => {
      expect(() => dataSources.set()).toThrow(
        new Error("Unknown data source: undefined")
      );
    });
    it("sets the source correctly", () => {
      expect(() => dataSources.set("electricityMapsApi")).not.toThrow(
        new Error("Unknown data source: unknown")
      );
    });
  });
});
