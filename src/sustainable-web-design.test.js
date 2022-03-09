const fs = require('fs');
const path = require('path');
const SustainableWebDesign = require('./sustainable-web-design');

describe('sustainable web design model', () => {
  const swd = new SustainableWebDesign();
  const averageWebsiteInBytes = 2257715.2;

  describe('energyPerVisit', function () {
    it('should return a number', () => {
      expect(typeof swd.energyPerVisit(2257715.2)).toBe('number');
    });

    it('should calculate the correct energy', () => {
      expect(swd.energyPerVisit(2257715.2)).toBe(0.0004513362121582032);
    });
  });

  describe('emissionsPerVisitInGrams', function () {
    it('should calculate the correct co2 per visit', () => {
      const averageWebsiteInBytes = 2257715.2;
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy)).toEqual(0.21);
    });

    it('should accept a dynamic KwH value', () => {
      const averageWebsiteInBytes = 2257715.2;
      const energy = swd.energyPerVisit(averageWebsiteInBytes);
      expect(swd.emissionsPerVisitInGrams(energy, 245)).toEqual(0.11);
    });
  });

  describe('annualEnergyInKwh', function () {
    it('should calculate the correct energy in kWh', () => {
      expect(swd.annualEnergyInKwh(averageWebsiteInBytes)).toBe(27092582400);
    });
  });

  describe('annualEmissionsInGrams', function () {
    it('should calculate the corrent energy in grams', () => {
      expect(swd.annualEmissionsInGrams(averageWebsiteInBytes)).toBe(
        27092582400
      );
    });
  });

  describe('annualSegmentEnergy', function () {
    it('should return the correct values', () => {
      expect(swd.annualSegmentEnergy(averageWebsiteInBytes)).toEqual({
        consumerDeviceEnergy: 1174011.9,
        dataCenterEnergy: 338657.28,
        networkEnergy: 316080.13,
        productionEnergy: 428965.89,
      });
    });
  });
});
