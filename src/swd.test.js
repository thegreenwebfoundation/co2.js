const fs = require("fs");
const path = require("path");
const SWD = require("./swd");

describe("swd", () => {
  let har, swd;
  const averageWebsiteInBytes = 2257715.2;

  beforeEach(() => {
    swd = new SWD();
    har = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../data/fixtures/tgwf.har"),
        "utf8"
      )
    );
  });

  describe("energyPerVisit", function () {
    it("should return a number", () => {
      expect(typeof swd.energyPerVisit(2257715.2)).toBe("number");
    });

    it("should calculate the correct energy", () => {
      expect(swd.energyPerVisit(2257715.2)).toBe(0.0012858824157714846);
    });
  });

  describe("emissionsPerVisitInGrams", function () {
    it("should calculate the correct co2 per visit", () => {
      const averageWebsiteInBytes = 2257715.2;
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy)).toEqual(0.61);
    });

    it("should accept a dynamic KwH value", () => {
      const averageWebsiteInBytes = 2257715.2;
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy, 245)).toEqual(0.32);
    });
  });

  describe("annualEnergyInKwh", function () {
    it("should calculate the correct energy in kWh", () => {
      expect(swd.annualEnergyInKwh(averageWebsiteInBytes)).toBe(27092582400);
    });
  });

  describe("annualEmissionsInGrams", function () {
    it("should calculate the corrent energy in grams", () => {
      expect(swd.annualEmissionsInGrams(averageWebsiteInBytes)).toBe(
        27092582400
      );
    });
  });

  describe("annualSegmentEngergy", function () {
    it("should return the correct values", () => {
      expect(swd.annualSegmentEngergy(averageWebsiteInBytes)).toEqual({
        consumerDeviceEnergy: 1174011.9,
        dataCenterEnergy: 338657.28,
        networkEnergy: 316080.13,
        productionEnergy: 428965.89,
      });
    });
  });
});
