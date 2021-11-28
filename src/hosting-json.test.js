"use strict";

const hosting = require("./hosting-json");
const path = require("path");

describe("hostingJSON", function () {
  const jsonPath = path.resolve(
    __dirname,
    "..",
    "data",
    "fixtures",
    "url2green.test.json"
  );
  const jsonPathGz = path.resolve(
    __dirname,
    "..",
    "data",
    "fixtures",
    "url2green.test.json.gz"
  );
  describe("checking a single domain with #check", function () {
    test("against the list of domains as JSON", async function () {
      const db = await hosting.loadJSON(jsonPath);
      const res = await hosting.check("google.com", db);
      expect(res).toEqual(true);
    });
  });
  describe("checking a single domain with #check", function () {
    test("against the list of domains as JSON loaded from a gzipped JSON", async function () {
      const db = await hosting.loadJSON(jsonPathGz);
      const res = await hosting.check("google.com", db);
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", function () {
    test("against the list of domains as JSON", async function () {
      const db = await hosting.loadJSON(jsonPath);
      const domains = ["google.com", "kochindustries.com"];

      const res = await hosting.check(domains, db);
      expect(res).toContain("google.com");
    });
  });
});
