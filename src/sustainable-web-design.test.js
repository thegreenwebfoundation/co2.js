import SustainableWebDesign from "./sustainable-web-design.js";
import { MILLION, SWD } from "./constants/test-constants.js";

describe("sustainable web design model", () => {
  const swd = new SustainableWebDesign();

  describe("energyPerByteByComponent", () => {
    it("should return a object with numbers for each system component", () => {
      // Compare these with the carbon intensity tab B7-B10.
      // https://docs.google.com/spreadsheets/d/1qC1f8jWKucXitQ9OnhhFcGO9NWwaSa35B4xcNvC5Mqs/edit#gid=0

      // These numbers should match the spreadsheet
      const groupedEnergy = swd.energyPerByteByComponent(MILLION);
      expect(groupedEnergy.consumerDeviceEnergy).toBeCloseTo(SWD.MILLION_ENERGY_PERBYTE_DEVICE, 5);
      expect(groupedEnergy.networkEnergy).toBeCloseTo(SWD.MILLION_ENERGY_PERBYTE_NETWORK, 5);
      expect(groupedEnergy.dataCenterEnergy).toBeCloseTo(SWD.MILLION_ENERGY_PERBYTE_DATACENTER, 5);
      expect(groupedEnergy.productionEnergy).toBeCloseTo(SWD.MILLION_ENERGY_PERBYTE_PRODUCTION, 5);
    });
  });

  describe("energyPerByte", () => {
    it("should return a number in kilowatt hours for the given data transfer in bytes", () => {
      const energyForTransfer = swd.energyPerByte(MILLION);
      expect(energyForTransfer).toBeCloseTo(SWD.MILLION_ENERGY_PERBYTE_TOTAL, 5);
    });
  });

  describe("perByte", () => {
    it("should return a single number for CO2 emissions", () => {
      expect(typeof swd.perByte(MILLION)).toBe("number");
    });
  });

  describe("perVisit", () => {
    it("should return a single number for CO2 emissions", () => {
      expect(typeof swd.perVisit(MILLION)).toBe("number");
    });
  });

  describe("energyPerVisit", () => {
    it("should return a number", () => {
      expect(typeof swd.energyPerVisit(MILLION)).toBe("number");
    });

    it("should calculate the correct energy", () => {
      expect(swd.energyPerVisit(MILLION)).toBeCloseTo(
        SWD.MILLION_ENERGY_PERVISIT_TOTAL, 5
      );
    });
  });

  describe("emissionsPerVisitInGrams", () => {
    it("should calculate the correct co2 per visit", () => {
      const energy = swd.energyPerVisit(MILLION);
      expect(swd.emissionsPerVisitInGrams(energy)).toBeCloseTo(
        SWD.MILLION_PERVISIT_GREY, 2
      );
    });

    it("should accept a dynamic KwH value", () => {
      const energy = swd.energyPerVisit(MILLION);
      expect(swd.emissionsPerVisitInGrams(energy, 436)).toBeCloseTo(
        SWD.MILLION_PERVISIT_GREY, 2
      );
    });
  });
});
