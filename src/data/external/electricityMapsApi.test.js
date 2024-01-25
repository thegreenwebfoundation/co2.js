"use strict";

import ElectricityMapApi from "./electricityMapApi.js";

describe("ElectricityMapApi", () => {
  let electricityMapApi;
  beforeEach(() => {
    electricityMapApi = new ElectricityMapApi();
  });
  describe("get", () => {
    it("returns the correct data", async () => {
      const data = await electricityMapApi.get("FR");
      expect(data.countryCode).toBe("FR");
    });
  });
  describe("getZones", () => {
    it("returns the correct zones", async () => {
      const zones = await electricityMapApi.getZones();
      expect(zones).toEqual(["a", "b", "c"]);
    });
  });
});
