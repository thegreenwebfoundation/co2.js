"use strict";

const fs = require("fs");
const path = require("path");

const hosting = require("./hosting");
const pagexray = require("pagexray");

const jsonPath = path.resolve(
  __dirname,
  "..",
  "data",
  "fixtures",
  "url2green.test.json"
);

describe("hosting", () => {
  let har;
  beforeEach(() => {
    har = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../data/fixtures/tgwf.har"),
        "utf8"
      )
    );
  });
  describe("checking all domains on a page object with #checkPage ", () => {
    it("it returns a list of green domains, when passed a page object", async () => {
      const pages = pagexray.convert(har);
      const pageXrayRun = pages[0];
      const db = await hosting.loadJSON(jsonPath);
      const greenDomains = await hosting.checkPage(pageXrayRun, db);

      expect(greenDomains).toHaveLength(11);
      const expectedGreendomains = [
        "maxcdn.bootstrapcdn.com",
        "thegreenwebfoundation.org",
        "www.thegreenwebfoundation.org",
        "fonts.googleapis.com",
        "ajax.googleapis.com",
        "assets.digitalclimatestrike.net",
        "cdnjs.cloudflare.com",
        "graphite.thegreenwebfoundation.org",
        "analytics.thegreenwebfoundation.org",
        "fonts.gstatic.com",
        "api.thegreenwebfoundation.org",
      ];
      greenDomains.forEach((dom) => {
        expect(expectedGreendomains).toContain(dom);
      });
    });
    // it(
    //   'it returns an empty list, when passed a page object with no green domains'
    // );
  });
  describe("checking a single domain with #check", () => {
    it("use the API instead", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const res = await hosting.check("google.com", db);
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", () => {
    it("Use the API", async () => {
      const db = await hosting.loadJSON(jsonPath);

      const res = await hosting.check(["google.com", "kochindustries.com"], db);
      expect(res).toContain("google.com");
    });
  });
  describe("explicitly checking multiple domains with #checkMulti", () => {
    it("use the API", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const res = await hosting.check(["google.com", "kochindustries.com"], db);
      expect(res).toContain("google.com");
    });
  });
});
