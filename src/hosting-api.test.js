"use strict";

import hosting from "./hosting-api.js";
/* eslint-disable jest/no-disabled-tests */

process.env["CO2JS_VERSION"] = "1.2.34";
const requestHeaderComment = "TestRunner";

// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ green: true }),
  })
);

describe("hostingAPI", () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
  });
  describe("checking a single domain with #check", () => {
    it("using the API", async () => {
      const res = await hosting.check("google.com");
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 " },
        })
      );
      expect(res).toEqual(true);
    });
    it("sets the correct user agent header", async () => {
      const res = await hosting.check("google.com", requestHeaderComment);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 TestRunner" },
        })
      );
      expect(res).toEqual(true);
    });
    it("handles the verbose=true option", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              url: "google.com",
              hosted_by: "Google Inc.",
              hosted_by_website: "https://www.google.com",
              green: true,
            }),
        })
      );
      const res = await hosting.check("google.com", { verbose: true });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 " },
        })
      );
      expect(res).toMatchObject({
        green: true,
        hosted_by: "Google Inc.",
        hosted_by_website: "https://www.google.com",
        url: "google.com",
      });
    });
  });
  describe("implicitly checking multiple domains with #check", () => {
    it("using the API", async () => {
      // @ts-ignore
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              "google.com": { url: "google.com", green: true },
            }),
        })
      );
      const res = await hosting.check(["google.com", "kochindustries.com"]);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(res).toContain("google.com");
    });
    it("sets the correct user agent header", async () => {
      const res = await hosting.check(
        ["google.com", "kochindustries.com"],
        requestHeaderComment
      );
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 TestRunner" },
        })
      );
      expect(res).toContain("google.com");
    });
    it("handles the verbose=true option", async () => {
      fetch.mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              "google.com": {
                url: "google.com",
                hosted_by: "Google Inc.",
                hosted_by_website: "https://www.google.com",
                green: true,
              },
              "kochindustries.com": {
                url: "kochindustries.com",
                green: false,
              },
            }),
        })
      );
      const res = await hosting.check(["google.com", "kochindustries.com"], {
        verbose: true,
      });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(res).toEqual({
        "google.com": expect.objectContaining({
          green: true,
          hosted_by: "Google Inc.",
          hosted_by_website: "https://www.google.com",
          url: "google.com",
        }),
        "kochindustries.com": expect.objectContaining({
          url: "kochindustries.com",
          green: false,
        }),
      });
    });
  });
});
/* eslint-enable jest/no-disabled-tests */
