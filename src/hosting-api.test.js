"use strict";

import hosting from "./hosting-node.js";
import https from "https";
/* eslint-disable jest/no-disabled-tests */

process.env.CO2JS_VERSION = "1.2.34";
const requestHeaderComment = "Test Runner";

describe("hostingAPI", () => {
  let httpsGetSpy;
  beforeEach(() => {
    httpsGetSpy = jest.spyOn(https, "get");
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("checking a single domain with #check", () => {
    it.skip("using the API", async () => {
      const res = await hosting.check("google.com", null, requestHeaderComment);
      expect(res).toEqual(true);
    });
    it("sets the correct user agent header", async () => {
      const res = await hosting.check("google.com", null, requestHeaderComment);
      expect(httpsGetSpy).toHaveBeenCalledTimes(1);
      expect(httpsGetSpy).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 Test Runner" },
        }),
        expect.any(Function)
      );
    });
  });
  describe("implicitly checking multiple domains with #check", () => {
    it.skip("using the API", async () => {
      const scope = nock("https://api.thegreenwebfoundation.org/")
        .get("/v2/greencheckmulti/[%22google.com%22,%22kochindustries.com%22]")
        .reply(200, {
          "google.com": {
            url: "google.com",
            green: true,
          },
          "kochindustries.com": {
            url: "kochindustries.com",
            green: null,
          },
        });
      const res = await hosting.check(["google.com", "kochindustries.com"]);
      expect(res).toContain("google.com");
    });
  });
});
/* eslint-enable jest/no-disabled-tests */
