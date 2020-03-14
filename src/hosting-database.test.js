"use strict";

const log = require("debug")("tgwf:hostingJSON:test");
const hosting = require("./hosting-database");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

describe("hostingDatabase", function() {
  describe.only("generating a dump of green domains #dump", function() {
    test.only("serialised as a JSON file", async function() {
      const jsonPath = path.resolve(__dirname, "..", "url2green.json");
      const dbPath = path.resolve(__dirname, "..", "url2green.db");

      // generate json
      const res = await hosting.dumpDomains(dbPath, jsonPath);

      // parse the json
      const jsonBuffer = await readFile(jsonPath);

      const parsedDomains = JSON.parse(jsonBuffer);

      expect(parsedDomains.length).toBeGreaterThan(1000);
    });
  });
  // describe("checking a single domain with #check", function () {
  //   test.skip("tries to use a local database if available ", async function () {
  //     const res = await hosting.check(
  //       "google.com",
  //       path.resolve(__dirname, "..", "url2green.test.db")
  //     );
  //     expect(res).toEqual(true);
  //   });
  // });
  // describe("implicitly checking multiple domains with #check", function () {
  //   test.skip("tries to use a local database if available", async function () {
  //     const res = await hosting.check(
  //       ["google.com", "kochindustries.com"],
  //       path.resolve(__dirname, "..", "url2green.test.db")
  //     );
  //     expect(res).toContain("google.com");
  //   });
  // });
});
