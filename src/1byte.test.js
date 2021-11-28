"use strict";

const oneByte = require("./1byte");

describe("onebyte", function () {

  describe("perByte", function () {
    it.only("returns a simple average of the different networks", function () {
      // we limit this to 12 figures with toFixed(12),
      //
      // const expected_val = 0.000_000_000_488.toFixed(12)
      const expected_val = 0.000_000_000_488.toFixed(12)
      0.0_000_000_004_883_333_333_333_333
      expect(
        oneByte.KWH_PER_BYTE_FOR_NETWORK.toFixed(12)).toBe(expected_val);
    });
  });

});
