"use strict";

const oneByte = require("./1byte");

describe("onebyte", function () {
  describe("perByte", function () {
    it.only("returns a simple average of the different networks", function () {
      // we limit this to 12 figures with toFixed(12), because
      // we have a recurring 333333 afterwards
      // 4.88e-10 is the same as 0.000000000488
      const expected_val = (0.000000000488).toFixed(12);

      expect(oneByte.KWH_PER_BYTE_FOR_NETWORK.toFixed(12)).toBe(expected_val);
    });
  });
});
