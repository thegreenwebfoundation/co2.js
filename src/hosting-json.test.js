"use strict";

const hosting = require("./hosting-json");
const path = require("path");
const jsonPath = path.resolve(__dirname, "..", "url2green.json");

describe("hostingJSON", function() {
  describe("checking a single domain with #check", function() {
    test("against the list of domains as JSON", async function() {
      const res = await hosting.check("google.com", jsonPath);
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", function() {
    test("against the list of domains as JSON", async function() {
      const domains = ["google.com", "kochindustries.com"];
      const res = await hosting.check(domains, jsonPath);
      expect(res).toContain("google.com");
    });
  });
});
