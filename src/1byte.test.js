"use strict";

import OneByte from "./1byte";

describe("onebyte", () => {
  describe("perByte", () => {
    it("returns a simple average of the different networks", () => {
      // we limit this to 12 figures with toFixed(12), because
      // we have a recurring 333333 afterwards
      // 4.88e-10 is the same as 0.000000000488
      const expected_val = (0.000000000488).toFixed(12);
      const instance = new OneByte();

      expect(instance.KWH_PER_BYTE_FOR_NETWORK.toFixed(12)).toBe(expected_val);
    });
  });
});
