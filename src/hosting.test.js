"use strict";

import fs from "fs";
import https from "https";
import path from "path";

import pagexray from "pagexray";

import hosting from "./hosting-node.js";

jest.mock("https");

process.env.CO2JS_VERSION = "1.2.34";
const requestHeaderComment = "TestRunner";

const jsonPath = path.resolve(
  __dirname,
  "..",
  "data",
  "fixtures",
  "url2green.test.json"
);

describe("hosting", () => {
  let har;
  let httpsGetSpy;
  beforeEach(() => {
    har = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../data/fixtures/tgwf.har"),
        "utf8"
      )
    );
    httpsGetSpy = jest.spyOn(https, "get");
    jest.clearAllMocks();
  });
  describe("checking all domains on a page object with #checkPage", () => {
    it("returns a list of green domains, when passed a page object", async () => {
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
  });
  describe("checking a single domain with #check", () => {
    it("use the API instead", async () => {
      const res = await hosting.check("google.com");
      expect(res).toEqual(true);
    });
    it("use the API instead with verbose=true", async () => {
      const res = await hosting.check("google.com", {
        verbose: true,
      });
      expect(res).toMatchObject({
        green: true,
        hosted_by: "Google Inc.",
        hosted_by_website: "https://www.google.com",
        url: "google.com",
      });
    });
    it("sets the correct user agent header", async () => {
      await hosting.check("google.com", {
        userAgentIdentifier: requestHeaderComment,
      });
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

    it("use the API with verbose=true", async () => {
      const res = await hosting.check(["google.com", "pchome.com"], {
        verbose: true,
      });
      expect(res).toEqual({
        "google.com": expect.objectContaining({
          green: true,
          hosted_by: "Google Inc.",
          hosted_by_website: "https://www.google.com",
          url: "google.com",
        }),
        "pchome.com": expect.objectContaining({
          url: "pchome.com",
          green: false,
        }),
      });
    });
  });
});
