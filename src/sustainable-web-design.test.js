import SustainableWebDesign from "./sustainable-web-design.js";

describe("sustainable web design model", () => {
  const swd = new SustainableWebDesign();
  const averageWebsiteInBytes = 2257715.2;

  describe("energyPerByteByComponent", () => {
    it("should return a object with numbers for each system component", () => {
      // Compare these with the carbon intensity tab C7-C10.
      // https://docs.google.com/spreadsheets/d/1eFlHhSBus_HqmoXqX237eAYr0PREUhTr6YBxznQC4jI/edit#gid=0

      // These numbers should match the spreadsheet
      const groupedEnergy = swd.energyPerByteByComponent(averageWebsiteInBytes);
      expect(groupedEnergy.consumerDeviceEnergy).toBeCloseTo(0.00095095, 8);
      expect(groupedEnergy.networkEnergy).toBeCloseTo(0.00025602, 7);
      expect(groupedEnergy.dataCenterEnergy).toBeCloseTo(0.00027431, 8);
      expect(groupedEnergy.productionEnergy).toBeCloseTo(0.0003475, 7);
    });
  });

  describe("energyPerByte", () => {
    it("should return a number in kilowatt hours for the given data transfer in bytes", () => {
      const energyForTransfer = swd.energyPerByte(averageWebsiteInBytes);
      expect(energyForTransfer).toBeCloseTo(0.00182874, 7);
    });
  });

  describe("perByte", () => {
    it("should return a single number for CO2 emissions", () => {
      expect(typeof swd.perByte(2257715.2)).toBe("number");
    });
  });

  describe("perVisit", () => {
    it("should return a single number for CO2 emissions", () => {
      expect(typeof swd.perVisit(2257715.2)).toBe("number");
    });
  });

  describe("energyPerVisit", () => {
    it("should return a number", () => {
      expect(typeof swd.energyPerVisit(averageWebsiteInBytes)).toBe("number");
    });

    it("should calculate the correct energy", () => {
      expect(swd.energyPerVisit(averageWebsiteInBytes)).toBe(
        0.0013807057305600004
      );
    });
  });

  describe("emissionsPerVisitInGrams", () => {
    it("should calculate the correct co2 per visit", () => {
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy)).toEqual(0.6);
    });

    it("should accept a dynamic KwH value", () => {
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy, 245)).toEqual(0.34);
    });
  });

  describe("annualEnergyInKwh", () => {
    it("should calculate the correct energy in kWh", () => {
      expect(swd.annualEnergyInKwh(averageWebsiteInBytes)).toBe(27092582400);
    });
  });

  describe("annualEmissionsInGrams", () => {
    it("should calculate the corrent energy in grams", () => {
      expect(swd.annualEmissionsInGrams(averageWebsiteInBytes)).toBe(
        27092582400
      );
    });
  });

  describe("annualSegmentEnergy", () => {
    it("should return the correct values", () => {
      expect(swd.annualSegmentEnergy(averageWebsiteInBytes)).toEqual({
        consumerDeviceEnergy: 1174011.9,
        dataCenterEnergy: 338657.28,
        networkEnergy: 316080.13,
        productionEnergy: 428965.89,
      });
    });
  });
});
