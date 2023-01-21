"use strict";

import fs from "fs";
import path from "path";

import pagexray from "pagexray";

import CO2 from "./co2.js";
import { averageIntensity, marginalIntensity } from "./index.js";
const MILLION = 1000000;

describe("co2", () => {
  let har, co2;

  describe("1 byte model", () => {
    const TGWF_GREY_VALUE = 0.20497;
    const TGWF_GREEN_VALUE = 0.54704;
    const TGWF_MIXED_VALUE = 0.16718;

    const MILLION_GREY = 0.29081;
    const MILLION_GREEN = 0.23196;

    beforeEach(() => {
      co2 = new CO2({ model: "1byte" });
      har = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "../data/fixtures/tgwf.har"),
          "utf8"
        )
      );
    });

    describe("perByte", () => {
      it("returns a CO2 number for data transfer using 'grey' power", () => {
        expect(co2.perByte(MILLION).toFixed(5)).toBe(MILLION_GREY.toFixed(5));
      });

      it("returns a lower CO2 number for data transfer from domains using entirely 'green' power", () => {
        expect(co2.perByte(MILLION).toFixed(5)).toBe(MILLION_GREY.toFixed(5));
        expect(co2.perByte(MILLION, true).toFixed(5)).toBe(
          MILLION_GREEN.toFixed(5)
        );
      });
    });

    describe("perPage", () => {
      it("returns CO2 for total transfer for page", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];

        expect(co2.perPage(pageXrayRun).toFixed(5)).toBe(
          TGWF_GREY_VALUE.toFixed(5)
        );
      });
      it("returns lower CO2 for page served from green site", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        let green = [
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
        expect(co2.perPage(pageXrayRun, green)).toBeLessThan(TGWF_GREY_VALUE);
      });
      it("returns a lower CO2 number where *some* domains use green power", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        // green can be true, or a array containing entries
        let green = [
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
        expect(co2.perPage(pageXrayRun, green).toFixed(5)).toBe(
          TGWF_MIXED_VALUE.toFixed(5)
        );
      });
    });
    describe("perDomain", () => {
      it("shows object listing Co2 for each domain", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        const res = co2.perDomain(pageXrayRun);

        const domains = [
          "thegreenwebfoundation.org",
          "www.thegreenwebfoundation.org",
          "maxcdn.bootstrapcdn.com",
          "fonts.googleapis.com",
          "ajax.googleapis.com",
          "assets.digitalclimatestrike.net",
          "cdnjs.cloudflare.com",
          "graphite.thegreenwebfoundation.org",
          "analytics.thegreenwebfoundation.org",
          "fonts.gstatic.com",
          "api.thegreenwebfoundation.org",
        ];

        for (let obj of res) {
          expect(domains.indexOf(obj.domain)).toBeGreaterThan(-1);
          expect(typeof obj.co2).toBe("number");
        }
      });
      it("shows lower Co2 for green domains", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];

        const greenDomains = [
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
        const res = co2.perDomain(pageXrayRun);
        const resWithGreen = co2.perDomain(pageXrayRun, greenDomains);

        for (let obj of res) {
          expect(typeof obj.co2).toBe("number");
        }
        for (let obj of greenDomains) {
          let index = 0;
          expect(resWithGreen[index].co2).toBeLessThan(res[index].co2);
          index++;
        }
      });
    });
  });

  describe("Sustainable Web Design model as simple option", () => {
    // the SWD model should have slightly higher values as
    // we include more of the system in calculations for the
    // same levels of data transfer
    const MILLION_GREY = 0.35802;
    const MILLION_GREEN = 0.31039;
    const MILLION_PERVISIT_GREY = 0.27031;
    const MILLION_PERVISIT_GREEN = 0.23435;

    const MILLION_GREY_DEVICES = 0.18617;
    const MILLION_GREY_NETWORKS = 0.05012;
    const MILLION_GREY_DATACENTERS = 0.0537;
    const MILLION_GREEN_DATACENTERS = 0.00607;
    const MILLION_GREY_PRODUCTION = 0.06802;

    const MILLION_PERVISIT_GREY_DEVICES_FIRST = 0.13963;
    const MILLION_PERVISIT_GREY_DEVICES_SECOND = 0.00093;
    const MILLION_PERVISIT_GREY_NETWORKS_FIRST = 0.03759;
    const MILLION_PERVISIT_GREY_NETWORKS_SECOND = 0.00025;
    const MILLION_PERVISIT_GREY_DATACENTERS_FIRST = 0.04028;
    const MILLION_PERVISIT_GREY_DATACENTERS_SECOND = 0.00027;
    const MILLION_PERVISIT_GREEN_DATACENTERS_FIRST = 0.00456;
    const MILLION_PERVISIT_GREEN_DATACENTERS_SECOND = 0.00003;
    const MILLION_PERVISIT_GREY_PRODUCTION_FIRST = 0.05102;
    const MILLION_PERVISIT_GREY_PRODUCTION_SECOND = 0.00034;

    const TGWF_GREY_VALUE = 0.25234;
    const TGWF_GREEN_VALUE = 0.54704;
    const TGWF_MIXED_VALUE = 0.22175;

    // We're not passing in a model parameter here to check that SWD is used by default
    beforeEach(() => {
      co2 = new CO2();
      har = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "../data/fixtures/tgwf.har"),
          "utf8"
        )
      );
    });

    describe("perByte", () => {
      it("returns a CO2 number for data transfer", () => {
        co2.perByte(MILLION);
        expect(co2.perByte(MILLION).toFixed(5)).toBe(MILLION_GREY.toFixed(5));
      });

      it("returns a lower CO2 number for data transfer from domains using entirely 'green' power", () => {
        expect(co2.perByte(MILLION, false).toFixed(5)).toBe(
          MILLION_GREY.toFixed(5)
        );

        expect(co2.perByte(MILLION, true).toFixed(5)).toBe(
          MILLION_GREEN.toFixed(5)
        );
      });
    });

    describe("perVisit", () => {
      it("returns a CO2 number for data transfer per visit with caching assumptions from the Sustainable Web Design model", () => {
        co2.perVisit(MILLION);
        expect(co2.perVisit(MILLION).toFixed(5)).toBe(
          MILLION_PERVISIT_GREY.toFixed(5)
        );
      });

      it("returns a lower CO2 number for data transfer from domains using entirely 'green' power", () => {
        expect(co2.perVisit(MILLION, false).toFixed(5)).toBe(
          MILLION_PERVISIT_GREY.toFixed(5)
        );

        expect(co2.perVisit(MILLION, true).toFixed(5)).toBe(
          MILLION_PERVISIT_GREEN.toFixed(5)
        );
      });
    });

    describe("perPage", () => {
      it("returns CO2 for total transfer for page", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];

        expect(co2.perPage(pageXrayRun).toFixed(5)).toBe(
          TGWF_GREY_VALUE.toFixed(5)
        );
      });
      it("returns lower CO2 for page served from green site", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        let green = [
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
        expect(co2.perPage(pageXrayRun, green)).toBeLessThan(TGWF_GREY_VALUE);
      });
      it("returns a lower CO2 number where *some* domains use green power", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        // green can be true, or a array containing entries
        let green = [
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
        expect(co2.perPage(pageXrayRun, green).toFixed(5)).toBe(
          TGWF_MIXED_VALUE.toFixed(5)
        );
      });
    });
    describe("perDomain", () => {
      it("shows object listing Co2 for each domain", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];
        const res = co2.perDomain(pageXrayRun);

        const domains = [
          "thegreenwebfoundation.org",
          "www.thegreenwebfoundation.org",
          "maxcdn.bootstrapcdn.com",
          "fonts.googleapis.com",
          "ajax.googleapis.com",
          "assets.digitalclimatestrike.net",
          "cdnjs.cloudflare.com",
          "graphite.thegreenwebfoundation.org",
          "analytics.thegreenwebfoundation.org",
          "fonts.gstatic.com",
          "api.thegreenwebfoundation.org",
        ];

        for (let obj of res) {
          expect(domains.indexOf(obj.domain)).toBeGreaterThan(-1);
          expect(typeof obj.co2).toBe("number");
        }
      });
      it("shows lower Co2 for green domains", () => {
        const pages = pagexray.convert(har);
        const pageXrayRun = pages[0];

        const greenDomains = [
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
        const res = co2.perDomain(pageXrayRun);
        const resWithGreen = co2.perDomain(pageXrayRun, greenDomains);

        for (let obj of res) {
          expect(typeof obj.co2).toBe("number");
        }
        for (let obj of greenDomains) {
          let index = 0;
          expect(resWithGreen[index].co2).toBeLessThan(res[index].co2);
          index++;
        }
      });
    });
    describe("Returning results by segment", () => {
      describe("perVisit", () => {
        it("returns an object with devices, networks, data centers, and production emissions shown separately, as well as the total emissions", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perVisit(MILLION);
          expect(res["consumerDeviceCO2 - first"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_DEVICES_FIRST.toFixed(5)
          );
          expect(res["networkCO2 - first"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_NETWORKS_FIRST.toFixed(5)
          );
          expect(res["dataCenterCO2 - first"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_DATACENTERS_FIRST.toFixed(5)
          );
          expect(res["productionCO2 - first"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_PRODUCTION_FIRST.toFixed(5)
          );
          expect(res["consumerDeviceCO2 - subsequent"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_DEVICES_SECOND.toFixed(5)
          );
          expect(res["networkCO2 - subsequent"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_NETWORKS_SECOND.toFixed(5)
          );
          expect(res["dataCenterCO2 - subsequent"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_DATACENTERS_SECOND.toFixed(5)
          );
          expect(res["productionCO2 - subsequent"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_PRODUCTION_SECOND.toFixed(5)
          );
          expect(res.total.toFixed(5)).toBe(MILLION_PERVISIT_GREY.toFixed(5));
        });
        it("returns adjusted data center and total emissions for when green, other values remain the same as grey", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perVisit(MILLION, true);
          // Since the data center emissions are the only ones that change, we can just check those
          // and the total. To check the rest stay the same as grey, we can just check the device results.
          expect(res["consumerDeviceCO2 - first"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_DEVICES_FIRST.toFixed(5)
          );

          expect(res["dataCenterCO2 - first"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREEN_DATACENTERS_FIRST.toFixed(5)
          );

          expect(res["consumerDeviceCO2 - subsequent"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREY_DEVICES_SECOND.toFixed(5)
          );
          expect(res["dataCenterCO2 - subsequent"].toFixed(5)).toBe(
            MILLION_PERVISIT_GREEN_DATACENTERS_SECOND.toFixed(5)
          );

          expect(res.total.toFixed(5)).toBe(MILLION_PERVISIT_GREEN.toFixed(5));
        });
      });
      describe("perByte", () => {
        it("returns adjusted data center and total emissions for when green, other values remain the same as grey", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perByte(MILLION, true);
          expect(res["consumerDeviceCO2"].toFixed(5)).toBe(
            MILLION_GREY_DEVICES.toFixed(5)
          );
          expect(res["dataCenterCO2"].toFixed(5)).toBe(
            MILLION_GREEN_DATACENTERS.toFixed(5)
          );
          expect(res.total.toFixed(5)).toBe(MILLION_GREEN.toFixed(5));
        });
        it("returns an object with devices, networks, data centers, and production emissions shown separately, as well as the total emissions", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perByte(MILLION);
          expect(res["consumerDeviceCO2"].toFixed(5)).toBe(
            MILLION_GREY_DEVICES.toFixed(5)
          );
          expect(res["networkCO2"].toFixed(5)).toBe(
            MILLION_GREY_NETWORKS.toFixed(5)
          );
          expect(res["dataCenterCO2"].toFixed(5)).toBe(
            MILLION_GREY_DATACENTERS.toFixed(5)
          );
          expect(res["productionCO2"].toFixed(5)).toBe(
            MILLION_GREY_PRODUCTION.toFixed(5)
          );
          expect(res.total.toFixed(5)).toBe(MILLION_GREY.toFixed(5));
        });
      });
    });
  });

  describe("Error checking", () => {
    // Test for error if incorrect model is passed
    it("throws an error if model is not valid", () => {
      expect(() => (co2 = new CO2({ model: "1direction" }))).toThrowError(
        `"1direction" is not a valid model. Please use "1byte" for the OneByte model, and "swd" for the Sustainable Web Design model.\nSee https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`
      );
    });

    // Test that an error is thrown when using the OneByte model with the perVisit method.
    it("throws an error if perVisit method is not supported by model", () => {
      expect(() => {
        co2 = new CO2({ model: "1byte" });
        co2.perVisit(10);
      }).toThrowError(
        `The perVisit() method is not supported in the model you are using. Try using perByte() instead.\nSee https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`
      );
    });
  });

  // Test that grid intensity data can be imported and used
  describe("Importing grid intensity", () => {
    describe("average intensity", () => {
      it("imports average intensity data", () => {
        expect(averageIntensity).toHaveProperty("type", "average");
      });
    });

    describe("marginal intensity", () => {
      it("imports average intensity data", () => {
        expect(marginalIntensity).toHaveProperty("type", "marginal");
      });
    });
  });
});
