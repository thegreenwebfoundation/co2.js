"use strict";

import hosting from "./hosting-json.node.js";
import path from "path";

describe("hostingJSON", () => {
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
  describe("checking a single domain with #check", () => {
    test("against the list of domains as JSON", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const res = await hosting.check("google.com", db);
      expect(res).toEqual(true);
    });
    test("against the list of domains as JSON loaded from a gzipped JSON", async () => {
      const db = await hosting.loadJSON(jsonPathGz);
      const res = await hosting.check("google.com", db);
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", () => {
    test("against the list of domains as JSON", async () => {
      const db = await hosting.loadJSON(jsonPath);
      const domains = ["google.com", "kochindustries.com"];

      const res = await hosting.check(domains, db);
      expect(res).toContain("google.com");
    });
  });
});
