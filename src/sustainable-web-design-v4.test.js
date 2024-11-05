import { describe, expect, it } from "vitest";

import SustainableWebDesign from "./sustainable-web-design-v4.js";
import { MILLION, SWDV4 } from "./constants/test-constants.js";
import { GIGABYTE } from "./constants/file-size.js";
import { SWDMV4_RATINGS } from "./constants/index.js";

const {
  FIFTH_PERCENTILE,
  TENTH_PERCENTILE,
  TWENTIETH_PERCENTILE,
  THIRTIETH_PERCENTILE,
  FORTIETH_PERCENTILE,
  FIFTIETH_PERCENTILE,
} = SWDMV4_RATINGS;

describe("sustainable web design model version 4", () => {
  const swd = new SustainableWebDesign();

  describe("operational emissions", () => {
    it("returns the expected emissions for 1GB data transfer", () => {
      const result = swd.operationalEmissions(GIGABYTE);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        }),
      );
      expect(result.dataCenter).toBeCloseTo(27.17, 3);
      expect(result.network).toBeCloseTo(29.146, 3);
      expect(result.device).toBeCloseTo(39.52, 3);
    });

    it("returns the expected emissions for 0 bytes data transfer", () => {
      const result = swd.operationalEmissions(0);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        }),
      );
      expect(result.dataCenter).toBeCloseTo(0, 3);
      expect(result.network).toBeCloseTo(0, 3);
      expect(result.device).toBeCloseTo(0, 3);
    });

    it("returns the expected emissions for 1GB data transfer with custom grid intensities", () => {
      const result = swd.operationalEmissions(GIGABYTE, {
        gridIntensity: {
          dataCenter: { value: 100 },
          network: { value: 200 },
          device: { value: 300 },
        },
      });

      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        }),
      );
      expect(result.dataCenter).toBeCloseTo(5.5, 3);
      expect(result.network).toBeCloseTo(11.8, 3);
      expect(result.device).toBeCloseTo(24, 3);
    });
  });

  describe("embodied emissions", () => {
    it("returns the expected emissions for 1GB data transfer", () => {
      const result = swd.embodiedEmissions(GIGABYTE);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        }),
      );
      expect(result.dataCenter).toBeCloseTo(5.928, 3);
      expect(result.network).toBeCloseTo(6.422, 3);
      expect(result.device).toBeCloseTo(40.014, 3);
    });

    it("returns the expected emissions for 0 bytes data transfer", () => {
      const result = swd.embodiedEmissions(0);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        }),
      );
      expect(result.dataCenter).toBeCloseTo(0, 3);
      expect(result.network).toBeCloseTo(0, 3);
      expect(result.device).toBeCloseTo(0, 3);
    });
  });

  describe("emissions per byte", () => {
    it("returns the expected emissions for 1GB data transfer with no green energy factor", () => {
      const result = swd.perByte(GIGABYTE);
      expect(result).toBeCloseTo(SWDV4.PERBYTE_EMISSIONS_GB, 3);
    });

    it("returns the expected emissions for 1GB data transfer with green energy factor", () => {
      const result = swd.perByte(GIGABYTE, true);
      expect(result).toBeCloseTo(SWDV4.PERBYTE_EMISSIONS_GB_GREEN, 3);
    });

    it("returns the expected emissions for 1GB data transfer with green energy factor of 0.5", () => {
      const result = swd.perByte(GIGABYTE, false, false, false, {
        greenHostingFactor: 0.5,
      });

      expect(result).toBeCloseTo(SWDV4.PERBYTE_EMISSIONS_GB_GREEN_PARTIAL, 3);
    });

    it("returns the expected emissions for 0 bytes data transfer", () => {
      const result = swd.perByte(0);
      expect(result).toBe(0);
    });

    it("returns the expected emissions results for each segment for 1GB data transfer", () => {
      const result = swd.perByte(GIGABYTE, false, true);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenterOperationalCO2e: expect.any(Number),
          networkOperationalCO2e: expect.any(Number),
          consumerDeviceOperationalCO2e: expect.any(Number),
          totalOperationalCO2e: expect.any(Number),
          dataCenterEmbodiedCO2e: expect.any(Number),
          networkEmbodiedCO2e: expect.any(Number),
          consumerDeviceEmbodiedCO2e: expect.any(Number),
          totalEmbodiedCO2e: expect.any(Number),
          dataCenterCO2e: expect.any(Number),
          networkCO2e: expect.any(Number),
          consumerDeviceCO2e: expect.any(Number),
          total: expect.any(Number),
        }),
      );

      expect(result.dataCenterOperationalCO2e).toBeCloseTo(
        SWDV4.DC_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.networkOperationalCO2e).toBeCloseTo(
        SWDV4.NETWORK_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.consumerDeviceOperationalCO2e).toBeCloseTo(
        SWDV4.DEVICE_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.totalOperationalCO2e).toBeCloseTo(
        SWDV4.TOTAL_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.dataCenterEmbodiedCO2e).toBeCloseTo(
        SWDV4.DC_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.networkEmbodiedCO2e).toBeCloseTo(
        SWDV4.NETWORK_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.consumerDeviceEmbodiedCO2e).toBeCloseTo(
        SWDV4.DEVICE_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.totalEmbodiedCO2e).toBeCloseTo(
        SWDV4.TOTAL_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.dataCenterCO2e).toBeCloseTo(SWDV4.TOTAL_DC_EMISSIONS_GB, 3);
      expect(result.networkCO2e).toBeCloseTo(
        SWDV4.TOTAL_NETWORK_EMISSIONS_GB,
        3,
      );
      expect(result.consumerDeviceCO2e).toBeCloseTo(
        SWDV4.TOTAL_DEVICE_EMISSIONS_GB,
        3,
      );
      expect(result.total).toBeCloseTo(SWDV4.PERBYTE_EMISSIONS_GB, 3);
    });

    it("returns a rating without segments", () => {
      const result = swd.perByte(GIGABYTE, false, false, true);

      expect(result).toEqual(
        expect.objectContaining({
          rating: expect.any(String),
          total: expect.any(Number),
        }),
      );

      expect(result.rating).toBe("F");
    });

    it("returns a rating with segments", () => {
      const result = swd.perByte(GIGABYTE, false, true, true);

      expect(result).toEqual(
        expect.objectContaining({
          rating: expect.any(String),
          dataCenterOperationalCO2e: expect.any(Number),
          networkOperationalCO2e: expect.any(Number),
          consumerDeviceOperationalCO2e: expect.any(Number),
          totalOperationalCO2e: expect.any(Number),
          dataCenterEmbodiedCO2e: expect.any(Number),
          networkEmbodiedCO2e: expect.any(Number),
          consumerDeviceEmbodiedCO2e: expect.any(Number),
          totalEmbodiedCO2e: expect.any(Number),
          dataCenterCO2e: expect.any(Number),
          networkCO2e: expect.any(Number),
          consumerDeviceCO2e: expect.any(Number),
          total: expect.any(Number),
        }),
      );

      expect(result.rating).toBe("F");
    });
  });

  describe("emissions per visit", () => {
    it("returns the expected emissions for 1GB data transfer with no green energy factor, 75% new visitors, 20% data reload ratio", () => {
      const result = swd.perVisit(GIGABYTE, false, false, false, {
        firstVisitPercentage: 0.75,
        returnVisitPercentage: 0.25,
        dataReloadRatio: 0.2,
      });
      expect(result).toBeCloseTo(SWDV4.PERVISIT_EMISSIONS_GB, 3);
    });

    it("returns the expected emissions for 1GB data transfer with green energy factor", () => {
      const result = swd.perVisit(GIGABYTE, true, false, false, {
        firstVisitPercentage: 0.75,
        returnVisitPercentage: 0.25,
        dataReloadRatio: 0.2,
      });
      expect(result).toBeCloseTo(SWDV4.PERVISIT_EMISSIONS_GB_GREEN, 3);
    });

    it("returns the expected emissions for 1GB data transfer with green energy factor of 0.5", () => {
      const result = swd.perVisit(GIGABYTE, false, false, false, {
        greenHostingFactor: 0.5,
        firstVisitPercentage: 0.75,
        returnVisitPercentage: 0.25,
        dataReloadRatio: 0.2,
      });

      expect(result).toBeCloseTo(SWDV4.PERVISIT_EMISSIONS_GB_GREEN_PARTIAL, 3);
    });

    it("returns the expected emissions for 0 bytes data transfer", () => {
      const result = swd.perVisit(0);
      expect(result).toBe(0);
    });

    it("returns the expected emissions results for each segment for 1GB data transfer", () => {
      const result = swd.perVisit(GIGABYTE, false, true, false, {
        firstVisitPercentage: 0.75,
        returnVisitPercentage: 0.25,
        dataReloadRatio: 0.2,
      });
      expect(result).toEqual(
        expect.objectContaining({
          dataCenterOperationalCO2e: expect.any(Number),
          networkOperationalCO2e: expect.any(Number),
          consumerDeviceOperationalCO2e: expect.any(Number),
          totalOperationalCO2e: expect.any(Number),
          dataCenterEmbodiedCO2e: expect.any(Number),
          networkEmbodiedCO2e: expect.any(Number),
          consumerDeviceEmbodiedCO2e: expect.any(Number),
          totalEmbodiedCO2e: expect.any(Number),
          dataCenterCO2e: expect.any(Number),
          networkCO2e: expect.any(Number),
          consumerDeviceCO2e: expect.any(Number),
          firstVisitCO2e: expect.any(Number),
          returnVisitCO2e: expect.any(Number),
          total: expect.any(Number),
        }),
      );

      expect(result.dataCenterOperationalCO2e).toBeCloseTo(
        SWDV4.DC_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.networkOperationalCO2e).toBeCloseTo(
        SWDV4.NETWORK_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.consumerDeviceOperationalCO2e).toBeCloseTo(
        SWDV4.DEVICE_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.totalOperationalCO2e).toBeCloseTo(
        SWDV4.TOTAL_OPERATIONAL_EMISSIONS_GB,
        3,
      );
      expect(result.dataCenterEmbodiedCO2e).toBeCloseTo(
        SWDV4.DC_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.networkEmbodiedCO2e).toBeCloseTo(
        SWDV4.NETWORK_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.consumerDeviceEmbodiedCO2e).toBeCloseTo(
        SWDV4.DEVICE_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.totalEmbodiedCO2e).toBeCloseTo(
        SWDV4.TOTAL_EMBODIED_EMISSIONS_GB,
        3,
      );
      expect(result.dataCenterCO2e).toBeCloseTo(SWDV4.TOTAL_DC_EMISSIONS_GB, 3);
      expect(result.networkCO2e).toBeCloseTo(
        SWDV4.TOTAL_NETWORK_EMISSIONS_GB,
        3,
      );
      expect(result.consumerDeviceCO2e).toBeCloseTo(
        SWDV4.TOTAL_DEVICE_EMISSIONS_GB,
        3,
      );
      expect(result.firstVisitCO2e).toBeCloseTo(148.2, 3);
      expect(result.returnVisitCO2e).toBeCloseTo(118.56, 3);
      expect(result.total).toBeCloseTo(SWDV4.PERVISIT_EMISSIONS_GB, 3);
    });

    it("returns a rating without segments", () => {
      const result = swd.perVisit(GIGABYTE, false, false, true);

      expect(result).toEqual(
        expect.objectContaining({
          rating: expect.any(String),
          total: expect.any(Number),
        }),
      );

      expect(result.rating).toBe("F");
    });

    it("returns a rating with segments", () => {
      const result = swd.perVisit(GIGABYTE, false, true, true);

      expect(result).toEqual(
        expect.objectContaining({
          rating: expect.any(String),
          dataCenterOperationalCO2e: expect.any(Number),
          networkOperationalCO2e: expect.any(Number),
          consumerDeviceOperationalCO2e: expect.any(Number),
          totalOperationalCO2e: expect.any(Number),
          dataCenterEmbodiedCO2e: expect.any(Number),
          networkEmbodiedCO2e: expect.any(Number),
          consumerDeviceEmbodiedCO2e: expect.any(Number),
          totalEmbodiedCO2e: expect.any(Number),
          dataCenterCO2e: expect.any(Number),
          networkCO2e: expect.any(Number),
          consumerDeviceCO2e: expect.any(Number),
          firstVisitCO2e: expect.any(Number),
          returnVisitCO2e: expect.any(Number),
          total: expect.any(Number),
        }),
      );

      expect(result.rating).toBe("F");
    });
  });

  describe("SWD Rating Scale", () => {
    it("should return a string", () => {
      expect(typeof swd.ratingScale(GIGABYTE)).toBe("string");
    });

    it("should return a rating", () => {
      // Check a 3MB file size
      expect(swd.ratingScale(3000000)).toBe("F");
    });

    it("returns ratings as expected", () => {
      expect(swd.ratingScale(FIFTH_PERCENTILE)).toBe("A+");
      expect(swd.ratingScale(TENTH_PERCENTILE)).toBe("A");
      expect(swd.ratingScale(TWENTIETH_PERCENTILE)).toBe("B");
      expect(swd.ratingScale(THIRTIETH_PERCENTILE)).toBe("C");
      expect(swd.ratingScale(FORTIETH_PERCENTILE)).toBe("D");
      expect(swd.ratingScale(FIFTIETH_PERCENTILE)).toBe("E");
      expect(swd.ratingScale(0.9)).toBe("F");
    });
  });
});
