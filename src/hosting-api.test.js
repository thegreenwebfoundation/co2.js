"use strict";

import hosting from "./hosting-node.js";
import nock from "nock";
/* eslint-disable jest/no-disabled-tests */

process.env.CO2JS_VERSION = "1.2.34";
const requestHeaderComment = "Test Runner";

describe("hostingAPI", () => {
  describe("checking a single domain with #check", () => {
    it.skip("using the API", async () => {
      const scope = nock("https://api.thegreenwebfoundation.org/")
        .get("/greencheck/google.com")
        .reply(200, {
          url: "google.com",
          green: true,
        });
      const res = await hosting.check("google.com", requestHeaderComment);
      expect(res).toEqual(true);
    });
    it("sets the correct user agent header", async () => {
      let userAgent;
      const scope = nock("https://api.thegreenwebfoundation.org/")
        .get("/greencheck/google.com")
        .reply(200, function () {
          userAgent = this.req.headers["User-Agent"];
          return {
            url: "google.com",
            green: true,
          };
        });
      const res = await hosting.check("google.com", requestHeaderComment);
      expect(userAgent).toEqual("co2js/1.2.34 Test Runner");
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
