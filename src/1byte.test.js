"use strict";

import OneByte from "./1byte.js";

describe("OneByte", () => {
  describe("perByte", () => {
    it("returns 0 for byte counts less than 1", () => {
      const instance = new OneByte();

      expect(instance.perByte(0)).toBe(0);
      expect(instance.perByte(0.99)).toBe(0);
      expect(instance.perByte(-1)).toBe(0);
    });

    it("returns a result for grey energy", () => {
      const instance = new OneByte();

      expect(instance.perByte(1000)).toBeCloseTo(0.00029, 5);
    });

    it("returns a result for green energy", () => {
      const instance = new OneByte();

      expect(instance.perByte(1000, true)).toBeCloseTo(0.00023, 5);
    });
  });
});
