"use strict";

import DataSources from "./data.js";

describe("DataSources", () => {
  let dataSources;
  describe("set", () => {
    beforeEach(() => {
      dataSources = new DataSources();
    });
    it("throws an error when the data source is unknown", () => {
      expect(() => dataSources.set("unknown")).toThrow(
        new Error("Unknown data source: unknown")
      );
    });
    it("sets the source correctly", () => {
      expect(() => dataSources.set("electricityMapsApi")).not.toThrow(
        new Error("Unknown data source: unknown")
      );
    });
  });
  describe("get", () => {
    beforeEach(() => {
      dataSources = new DataSources();
      dataSources.set("electricityMapsApi");
    });
    it("returns the correct data", async () => {
      const data = await dataSources.get("FR");
      expect(data.countryCode).toBe("FR");
    });
  });
});
