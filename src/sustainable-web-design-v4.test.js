import SustainableWebDesign from "./sustainable-web-design-v4.js";
import { MILLION, SWDV4 } from "./constants/test-constants.js";

describe("sustainable web design model version 4", () => {
  const swd = new SustainableWebDesign();

  describe("operational emissions", () => {
    it("returns the expected emissions for 1GB data transfer", () => {
      const result = swd.operationalEmissions(1000000000);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        })
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
        })
      );
      expect(result.dataCenter).toBeCloseTo(0, 3);
      expect(result.network).toBeCloseTo(0, 3);
      expect(result.device).toBeCloseTo(0, 3);
    });

    it("returns the expected emissions for 1GB data transfer with custom grid intensities", () => {
      const result = swd.operationalEmissions(1000000000, {
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
        })
      );
      expect(result.dataCenter).toBeCloseTo(5.5, 3);
      expect(result.network).toBeCloseTo(11.8, 3);
      expect(result.device).toBeCloseTo(24, 3);
    });
  });

  describe("embodied emissions", () => {
    it("returns the expected emissions for 1GB data transfer", () => {
      const result = swd.embodiedEmissions(1000000000);
      expect(result).toEqual(
        expect.objectContaining({
          dataCenter: expect.any(Number),
          network: expect.any(Number),
          device: expect.any(Number),
        })
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
        })
      );
      expect(result.dataCenter).toBeCloseTo(0, 3);
      expect(result.network).toBeCloseTo(0, 3);
      expect(result.device).toBeCloseTo(0, 3);
    });
  });
});
