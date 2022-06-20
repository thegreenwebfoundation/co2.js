"use strict";

import hosting from "./hosting-node";
import nock from "nock";

describe("hostingAPI", () => {
  describe("checking a single domain with #check", () => {
    /* eslint-disable jest/no-disabled-tests */
    it.skip("using the API", async () => {
      const scope = nock("https://api.thegreenwebfoundation.org/")
        .get("/greencheck/google.com")
        .reply(200, {
          url: "google.com",
          green: true,
        });
      const res = await hosting.check("google.com");
      expect(res).toEqual(true);
    });
    /* eslint-enable jest/no-disabled-tests */
  });
  describe("implicitly checking multiple domains with #check", () => {
    // skipping this as nock does not seem to mock the node-native
    // fetch API yet
    /* eslint-disable jest/no-disabled-tests */
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
    /* eslint-enable jest/no-disabled-tests */
  });
});
