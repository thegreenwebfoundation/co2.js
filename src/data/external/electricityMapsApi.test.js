"use strict";

import ElectricityMapApi from "./electricityMapsApi.js";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("ElectricityMapApi", () => {
  let electricityMapApi;
  let electricityMapApiWithoutAuthToken;
  beforeEach(() => {
    electricityMapApi = new ElectricityMapApi({
      authToken: "test-1234",
    });
    electricityMapApiWithoutAuthToken = new ElectricityMapApi();
    fetch.mockClear();
  });
  describe("it sets the Auth token", () => {
    it("should set the Auth token correctly", () => {
      electricityMapApi = new ElectricityMapApi({
        authToken: "test-1234",
      });
      expect(electricityMapApi.authToken).toBe("test-1234");
    });
  });
  describe("get latest grid intensity", () => {
    it("needs an Auth token", async () => {
      await expect(
        electricityMapApiWithoutAuthToken.getLatest("TWN", 0, 0)
      ).rejects.toThrow(
        new Error(
          "An authentication token is required to access this endpoint."
        )
      );
    });
    it("returns an error when the response is an error", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              status: "error",
              message: "Zone 'TWN' does not exist.",
            }),
        })
      );
      await expect(electricityMapApi.getLatest("TWN", 0, 0)).rejects.toThrow(
        new Error("Zone 'TWN' does not exist.")
      );
    });
    it("returns the correct data", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              zone: "TW",
              carbonIntensity: 492,
              datetime: "2024-01-27T13:00:00.000Z",
              updatedAt: "2024-01-27T12:47:05.424Z",
              createdAt: "2024-01-24T13:49:22.390Z",
              emissionFactorType: "lifecycle",
              isEstimated: true,
              estimationMethod: "TIME_SLICER_AVERAGE",
            }),
        })
      );
      const data = await electricityMapApi.getLatest("TW", 0, 0);
      expect(data.data).toEqual({
        zone: "TW",
        carbonIntensity: 492,
        datetime: "2024-01-27T13:00:00.000Z",
        updatedAt: "2024-01-27T12:47:05.424Z",
        createdAt: "2024-01-24T13:49:22.390Z",
        emissionFactorType: "lifecycle",
        isEstimated: true,
        estimationMethod: "TIME_SLICER_AVERAGE",
      });
    });
  });
  describe("get historical grid intensity", () => {
    it("needs an Auth token", async () => {
      await expect(
        electricityMapApiWithoutAuthToken.getHistory("TWN", 0, 0)
      ).rejects.toThrow(
        new Error(
          "An authentication token is required to access this endpoint."
        )
      );
    });
    it("returns an error when the response is an error", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              status: "error",
              message: "Zone 'TWN' does not exist.",
            }),
        })
      );
      electricityMapApi.authToken = "test-1234";
      await expect(electricityMapApi.getHistory("TWN", 0, 0)).rejects.toThrow(
        new Error("Zone 'TWN' does not exist.")
      );
    });
  });
  describe("get zones", () => {
    it("returns the correct zones", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              AU: {
                zoneName: "Australia",
                access: [
                  "carbon-intensity/latest",
                  "carbon-intensity/history",
                  "power-breakdown/latest",
                  "power-breakdown/history",
                  "home-assistant/latest",
                  "home-assistant/past",
                  "home-assistant/past-range",
                  "home-assistant/history",
                  "home-assistant/forecast",
                  "/updated-since",
                ],
              },
              "AU-NSW": {
                countryName: "Australia",
                zoneName: "New South Wales",
                access: [
                  "carbon-intensity/latest",
                  "carbon-intensity/history",
                  "power-breakdown/latest",
                  "power-breakdown/history",
                  "home-assistant/latest",
                  "home-assistant/past",
                  "home-assistant/past-range",
                  "home-assistant/history",
                  "home-assistant/forecast",
                  "/updated-since",
                ],
              },
            }),
        })
      );
      const zones = await electricityMapApi.getZones();
      expect(zones).toEqual({
        AU: {
          zoneName: "Australia",
          access: [
            "carbon-intensity/latest",
            "carbon-intensity/history",
            "power-breakdown/latest",
            "power-breakdown/history",
            "home-assistant/latest",
            "home-assistant/past",
            "home-assistant/past-range",
            "home-assistant/history",
            "home-assistant/forecast",
            "/updated-since",
          ],
        },
        "AU-NSW": {
          countryName: "Australia",
          zoneName: "New South Wales",
          access: [
            "carbon-intensity/latest",
            "carbon-intensity/history",
            "power-breakdown/latest",
            "power-breakdown/history",
            "home-assistant/latest",
            "home-assistant/past",
            "home-assistant/past-range",
            "home-assistant/history",
            "home-assistant/forecast",
            "/updated-since",
          ],
        },
      });
    });
  });
});
