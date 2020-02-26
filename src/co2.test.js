'use strict';

const fs = require('fs');
const path = require('path');

const co2 = require('../src/co2');
// const hosting = require('../src/hosting');
const pagexray = require('pagexray');


describe('sustainableWeb', function () {
  describe('co2', function () {
    let har;
    const TGWF_GREY_VALUE = 0.8193815884799998;
    const TGWF_GREEN_VALUE = 0.54704300112;
    const TGWF_MIXED_VALUE = 0.57128033088;

    const MILLION = 1000000;
    const MILLION_GREY = 1.1625599999999998;
    const MILLION_GREEN = 0.77616;

    beforeEach(function () {
      har = JSON.parse(fs
        .readFileSync(path.resolve(__dirname, '../data/fixtures/tgwf.har'), 'utf8'))
    });

    describe('perByte', function () {


      it("returns a CO2 number for data transfer using 'grey' power", function () {
        expect(co2.perByte(MILLION)).toBe(MILLION_GREY);
      });

      it("returns a lower CO2 number for data transfer from domains using entirely 'green' power", function () {
        expect(co2.perByte(MILLION, false)).toBe(1.1625599999999998);
        expect(co2.perByte(MILLION, true)).toBe(MILLION_GREEN);
      });
    });

    describe('perPage', function () {
      it('returns CO2 for total transfer for page', function () {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];

        expect(co2.perPage(pageXrayRun)).toBe(TGWF_GREY_VALUE);
      });
      it('returns lower CO2 for page served from green site', function () {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        let green = [
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
        expect(co2.perPage(pageXrayRun, green)).toBeLessThan(TGWF_GREY_VALUE);
      });
      it('returns a lower CO2 number where *some* domains use green power', function () {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        // green can be true, or a array containing entries
        let green = [
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
        expect(co2.perPage(pageXrayRun, green)).toBe(TGWF_MIXED_VALUE);
      });
    });
    describe('perDomain', function () {
      it('shows object listing Co2 for each domain', function () {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        const res = co2.perDomain(pageXrayRun);

        const domains = [
          'thegreenwebfoundation.org',
          'www.thegreenwebfoundation.org',
          'maxcdn.bootstrapcdn.com',
          'fonts.googleapis.com',
          'ajax.googleapis.com',
          'assets.digitalclimatestrike.net',
          'cdnjs.cloudflare.com',
          'graphite.thegreenwebfoundation.org',
          'analytics.thegreenwebfoundation.org',
          'fonts.gstatic.com',
          'api.thegreenwebfoundation.org'
        ];

        for (let obj of res) {
          expect(domains.indexOf(obj.domain)).toBeGreaterThan(-1);
          expect(typeof obj.co2).toBe('number');
        };
      });
      it('shows lower Co2 for green domains', function () {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];

        const greenDomains = [
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
        const res = co2.perDomain(pageXrayRun);
        const resWithGreen = co2.perDomain(pageXrayRun, greenDomains);

        for (let obj of res) {
          expect(typeof obj.co2).toBe('number');
        };
        for (let obj of greenDomains) {
          let index = 0
          expect(resWithGreen[index].co2).toBeLessThan(res[index].co2);
          index++
        }
      });
    });
    describe('perContentType', function () {
      test.skip('shows a breakdown of emissions by content type', function () { });
    });
    describe('dirtiestResources', function () {
      it('shows the top 10 resources by CO2 emissions');
    });
  });
});




    // describe('hosting', function () {
    //   let har;
    //   beforeEach(function () {
    //     return fs
    //       .readFileAsync(
    //         path.resolve(
    //           __dirname,
    //           'fixtures',
    //           'www-thegreenwebfoundation-org.har'
    //         ),
    //         'utf8'
    //       )
    //       .then(JSON.parse)
    //       .tap(data => {
    //         har = data;
    //       });
    //   });

    //   describe('greenDomains', async function () {
    //     it('it returns a list of green domains, when passed a page object', async function () {
    //       const pages = pagexray.convert(har);
    //       const pageXrayRun = pages[0];

    //       // TODO find a way to not hit the API each time
    //       const greenDomains = await hosting.greenDomains(pageXrayRun);

    //       expect(greenDomains)
    //         .toBe.an('array')
    //         .of.length(10);

    //       const expectedGreendomains = [
    //         'thegreenwebfoundation.org',
    //         'www.thegreenwebfoundation.org',
    //         'fonts.googleapis.com',
    //         'ajax.googleapis.com',
    //         'assets.digitalclimatestrike.net',
    //         'cdnjs.cloudflare.com',
    //         'graphite.thegreenwebfoundation.org',
    //         'analytics.thegreenwebfoundation.org',
    //         'fonts.gstatic.com',
    //         'api.thegreenwebfoundation.org'
    //       ];
    //       greenDomains.forEach(function (dom) {
    //         expect(expectedGreendomains).to.include(dom);
    //       });
    //     });
    //     it(
    //       'it returns an empty list, when passed a page object with no green domains'
    //     );
    //   });
    // });
  // });
//