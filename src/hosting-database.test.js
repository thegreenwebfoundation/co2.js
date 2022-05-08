"use strict";

const log = require("debug")("tgwf:url2green:test");
const { hosting } = require("@tgwf/url2green");
const path = require("path");

const dbPath = path.resolve(
  __dirname,
  "..",
  "data",
  "fixtures",
  "url2green.test.db"
);

describe("hostingDatabase", () => {
  describe("checking a single domain with #check", () => {
    test("tries to use a local database if available", async () => {
      const res = await hosting.check("google.com", dbPath);
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", () => {
    test("tries to use a local database if available", async () => {
      const res = await hosting.check(
        ["google.com", "kochindustries.com"],
        dbPath
      );
      expect(res).toContain("google.com");
    });
  });
});
