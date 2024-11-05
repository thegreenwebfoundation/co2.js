"use strict";

import https from "https";
import path from "path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import hosting from "./hosting-node.js";

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
  let httpsGetSpy;
  beforeEach(() => {
    httpsGetSpy = vi.spyOn(https, "get");
    vi.clearAllMocks();
  });
  describe("checking domains against a db snapshot", () => {
    it("returns a list of green domains, when passed a database array", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const greenDomains = await hosting.check(
        ["www.thegreenwebfoundation.org", "fonts.googleapis.com"],
        db
      );

      expect(greenDomains).toHaveLength(2);
    });
    it("returns a list of green domains, when pass a database array via options", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const greenDomains = await hosting.check(
        ["www.thegreenwebfoundation.org", "fonts.googleapis.com"],
        { db }
      );

      expect(greenDomains).toHaveLength(2);
    });
    it("fails if verbose=true is set", async () => {
      const db = await hosting.loadJSON(jsonPath);
      await expect(() => {
        hosting.check(
          ["www.thegreenwebfoundation.org", "fonts.googleapis.com"],
          { verbose: true, db }
        );
      }).toThrowError(
        "verbose mode cannot be used with a local lookup database"
      );
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
    it("sets the correct user agent header when passed as a parameter", async () => {
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
