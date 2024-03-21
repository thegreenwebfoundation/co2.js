"use strict";

import hosting from "./hosting-api.js";
/* eslint-disable jest/no-disabled-tests */

process.env["CO2JS_VERSION"] = "1.2.34";
const requestHeaderComment = "TestRunner";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ green: true }),
  })
);

describe("hostingAPI", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  describe("checking a single domain with #check", () => {
    it("using the API", async () => {
      const res = await hosting.check("google.com");
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 " },
        })
      );
      expect(res).toEqual(true);
    });
    it("sets the correct user agent header", async () => {
      const res = await hosting.check("google.com", requestHeaderComment);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 TestRunner" },
        })
      );
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", () => {
    it("using the API", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              "google.com": { url: "google.com", green: true },
            }),
        })
      );
      const res = await hosting.check(["google.com", "kochindustries.com"]);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(res).toContain("google.com");
    });
    it("sets the correct user agent header", async () => {
      const res = await hosting.check(
        ["google.com", "kochindustries.com"],
        requestHeaderComment
      );
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 TestRunner" },
        })
      );
      expect(res).toContain("google.com");
    });
  });
});
/* eslint-enable jest/no-disabled-tests */
