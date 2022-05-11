const SustainableWebDesign = require("./sustainable-web-design");

describe("sustainable web design model", () => {
  const swd = new SustainableWebDesign();
  const averageWebsiteInBytes = 2257715.2;

  describe("energyPerByteByComponent", () => {
    it("should return a object with numbers for each system component", () => {
      const groupedEnergy = swd.energyPerByteByComponent(averageWebsiteInBytes);

      expect(groupedEnergy.consumerDeviceEnergy).toBeCloseTo(0.00088564, 8);
      expect(groupedEnergy.networkEnergy).toBeCloseTo(0.00023844, 8);
      expect(groupedEnergy.productionEnergy).toBeCloseTo(0.0003236, 8);
      expect(groupedEnergy.dataCenterEnergy).toBeCloseTo(0.00025547, 8);
    });
  });

  describe("energyPerByte", () => {
    it("should return a number in kilowatt hours for the given data transfer in bytes", () => {
      const energyForTransfer = swd.energyPerByte(averageWebsiteInBytes);
      expect(energyForTransfer).toBeCloseTo(0.00170316, 7);
    });
  });

  describe("perByte", () => {
    it("should return a single number for CO2 emissions", () => {
      expect(typeof swd.perByte(2257715.2)).toBe("number");
    });
  });

  describe("energyPerVisit", () => {
    it("should return a number", () => {
      expect(typeof swd.energyPerVisit(averageWebsiteInBytes)).toBe("number");
    });

    it("should calculate the correct energy", () => {
      expect(swd.energyPerVisit(averageWebsiteInBytes)).toBe(
        0.0004513362121582032
      );
    });

    it("should match the old calculations", () => {
      // Test the v0.9.0 updates to the SWD method to identify differences
      const v9currentEnergyCalc = swd.energyPerVisit(averageWebsiteInBytes);
      const v8VersionEnergyCalc = swd.energyPerVisitV8(averageWebsiteInBytes);

      // expect(currentEnergyCalc).toBe(0.0004513362121582032);
      // expect(oldVersionEnergyCalc).toBe(0.0012858824157714846);

      // Why do these values differ so much?
      expect(swd.emissionsPerVisitInGrams(v9currentEnergyCalc)).toEqual(0.2);
      expect(swd.emissionsPerVisitInGrams(v8VersionEnergyCalc)).toEqual(0.57);

      // expect(oldVersionEnergyCalc).toBe(currentEnergyCalc);
    });
  });

  describe("emissionsPerVisitInGrams", () => {
    it("should calculate the correct co2 per visit", () => {
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy)).toEqual(0.2);
    });

    it("should accept a dynamic KwH value", () => {
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy, 245)).toEqual(0.11);
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
