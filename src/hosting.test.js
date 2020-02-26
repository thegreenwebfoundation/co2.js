'use strict';

const fs = require('fs');
const path = require('path');

const co2 = require('./co2');
const hosting = require('./hosting');
const pagexray = require('pagexray');



describe('hosting', function () {
  let har;
  beforeEach(function () {
    har = JSON.parse(fs
      .readFileSync(path.resolve(__dirname, '../data/fixtures/tgwf.har'), 'utf8'))
  });
  describe('greenDomainsForPage', async function () {
    it('it returns a list of green domains, when passed a page object', async function () {
      const pages = pagexray.convert(har);
      const pageXrayRun = pages[0];

      // TODO find a way to not hit the API each time
      const greenDomains = await hosting.checkPage(pageXrayRun);

      expect(greenDomains)
        .toHaveLength(10);

      const expectedGreendomains = [
        'thegreenwebfoundation.org',
        'www.thegreenwebfoundation.org',
        'fonts.googleapis.com',
        'ajax.googleapis.com',
        'assets.digitalclimatestrike.net',
        'cdnjs.cloudflare.com',
        'graphite.thegreenwebfoundation.org',
        'analytics.thegreenwebfoundation.org',
        'fonts.gstatic.com',
        'api.thegreenwebfoundation.org'
      ];
      greenDomains.forEach(function (dom) {
        expect(expectedGreendomains).toContain(dom);
      });
    });
    it(
      'it returns an empty list, when passed a page object with no green domains'
    );
  });
  describe('checking a single domain against the local db', async function () {
    it("tries to use a local database if available ", async function () {
      const res = await hosting.check("google.com")
      expect(res).toEqual(true)
    })
    it("falls back to using the API to check instead", async function () {
      const res = await hosting.check("google.com", "incorrectDatabasePath")
      expect(res).toEqual(true)
    })

  })
  describe('checking a multiple domains against the local db', async function () {
    it("tries to use a local database if available", async function () {
      const res = await hosting.check(["google.com", "kochindustries.com"])
      expect(res).toContain("google.com")
    })
    it("falls back to the API when no db is present", async function () {
      const res = await hosting.check(["google.com", "kochindustries.com"], "incorrectDatabasePath")
      expect(res).toContain("google.com")
    })

  })
});