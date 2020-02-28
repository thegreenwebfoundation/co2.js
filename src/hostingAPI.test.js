'use strict';

const hosting = require('./hostingAPI');

describe('hostingAPI', function () {
  describe('checking a single domain with #check', function () {
    it("falls back to using the API to check instead", async function () {
      const res = await hosting.check("google.com")
      expect(res).toEqual(true)
    })

  })
  describe('implicitly checking multiple domains with #check', function () {
    it("falls back to the API when no db is present", async function () {
      const res = await hosting.check(["google.com", "kochindustries.com"])
      expect(res).toContain("google.com")
    })
  })
});