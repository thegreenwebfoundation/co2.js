"use strict";

const hosting = require("./hostingDatabase");
const path = require("path");

describe("hostingDatabase", function () {
  describe("checking a single domain with #check", function () {
    test.skip("tries to use a local database if available ", async function () {
      const res = await hosting.check(
        "google.com",
        path.resolve(__dirname, "..", "url2green.test.db")
      );
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", function () {
    test.skip("tries to use a local database if available", async function () {
      const res = await hosting.check(
        ["google.com", "kochindustries.com"],
        path.resolve(__dirname, "..", "url2green.test.db")
      );
      expect(res).toContain("google.com");
    });
  });
});
