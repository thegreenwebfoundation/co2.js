"use strict";

import path from "path";

import { hosting } from "@tgwf/url2green";

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
