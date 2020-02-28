'use strict';

const hosting = require('./hostingDatabase');

describe('hostingDatabase', function () {
 
  describe('checking a single domain with #check', function () {
    it("tries to use a local database if available ", async function () {
      const res = await hosting.check("google.com", "../url2green.test.db")
      expect(res).toEqual(true)
    })
  })
  describe('implicitly checking multiple domains with #check', function () {
    it("tries to use a local database if available", async function () {
      const res = await hosting.check(["google.com", "kochindustries.com"], "../url2green.test.db")
      expect(res).toContain("google.com")
    })
  })
});