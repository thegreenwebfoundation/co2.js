"use strict";

import https from "https";
import path from "path";

import hosting from "./hosting-node.js";

jest.mock("https");

process.env["CO2JS_VERSION"] = "1.2.34";
const requestHeaderComment = "TestRunner";

const jsonPath = path.resolve(
  __dirname,
  "..",
  "data",
  "fixtures",
  "url2green.test.json"
);

describe("hosting", () => {
  /** @type {unknown} */
  let har;
  /** @type {jest.SpyInstance<typeof https['get']>} */
  let httpsGetSpy;
  beforeEach(() => {
    httpsGetSpy = jest.spyOn(https, "get");
    jest.clearAllMocks();
  });
  describe("checking all domains on a page object with #checkPage", () => {
    it("returns a list of green domains, when passed a page object", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const greenDomains = await hosting.check(
        ["www.thegreenwebfoundation.org", "fonts.googleapis.com"],
        db
      );

      expect(greenDomains).toHaveLength(2);
      const expectedGreendomains = [
        "www.thegreenwebfoundation.org",
        "fonts.googleapis.com",
      ];
      expect(Array.isArray(greenDomains)).toBe(true);
      /** @type string[] */ (greenDomains).forEach((dom) => {
        expect(expectedGreendomains).toContain(dom);
      });
    });
  });
  describe("checking a single domain with #check", () => {
    it("use the API instead", async () => {
      const res = await hosting.check("google.com");
      expect(res).toEqual(true);
    });
    it("sets the correct user agent header", async () => {
      await hosting.check("google.com", null, requestHeaderComment);
      expect(httpsGetSpy).toHaveBeenCalledTimes(1);
      expect(httpsGetSpy).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 TestRunner" },
        }),
        expect.any(Function)
      );
    });
  });
  describe("checking multiple domains with #check", () => {
    it("Use the API", async () => {
      const res = await hosting.check(["google.com", "pchome.com"]);
      expect(res).toContain("google.com");
    });
  });
});
