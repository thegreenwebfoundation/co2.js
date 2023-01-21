"use strict";

import fs from "fs";
import path from "path";
import { testConstants } from "./constants/index.js";

import pagexray from "pagexray";

import CO2 from "./co2.js";
import { averageIntensity, marginalIntensity } from "./index.js";
const { MILLION, ONEBYTE, SWD } = testConstants;

describe("co2", () => {
  let har, co2;

  describe("1 byte model", () => {
    const {
      TGWF_GREY_VALUE,
      TGWF_GREEN_VALUE,
      TGWF_MIXED_VALUE,
      MILLION_GREY,
      MILLION_GREEN,
    } = ONEBYTE;

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

    const {
      MILLION_GREEN,
      MILLION_GREY,
      TGWF_GREY_VALUE,
      TGWF_MIXED_VALUE,
      MILLION_PERVISIT_GREY,
      MILLION_PERVISIT_GREEN,
    } = SWD;

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
      const {
        MILLION_GREY,
        MILLION_GREEN,
        MILLION_PERVISIT_GREY_DATACENTERS_FIRST,
        MILLION_PERVISIT_GREY_DEVICES_FIRST,
        MILLION_PERVISIT_GREY_NETWORKS_FIRST,
        MILLION_PERVISIT_GREY_PRODUCTION_FIRST,
        MILLION_PERVISIT_GREY_DATACENTERS_SECOND,
        MILLION_PERVISIT_GREY_DEVICES_SECOND,
        MILLION_PERVISIT_GREY_NETWORKS_SECOND,
        MILLION_PERVISIT_GREY_PRODUCTION_SECOND,
        MILLION_PERVISIT_GREEN_DATACENTERS_FIRST,
        MILLION_PERVISIT_GREEN_DATACENTERS_SECOND,
        MILLION_GREY_DEVICES,
        MILLION_GREY_NETWORKS,
        MILLION_GREY_DATACENTERS,
        MILLION_GREY_PRODUCTION,
        MILLION_GREEN_DATACENTERS,
      } = SWD;
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

  describe("perByte and perVisit trace function without options", () => {
    const co2 = new CO2();
    it("perByteTrace is the same as perByte", () => {
      expect(co2.perByteTrace(MILLION).co2).toBe(co2.perByte(MILLION));
      expect(co2.perByteTrace(MILLION, true).co2).toBe(
        co2.perByte(MILLION, true)
      );
      expect(co2.perByteTrace(MILLION, true, {}).co2).toBe(
        co2.perByte(MILLION, true)
      );
    });

    it("perVisitTrace is the same as perVisit", () => {
      expect(co2.perVisitTrace(MILLION).co2).toBe(co2.perVisit(MILLION));
      expect(co2.perVisitTrace(MILLION, true).co2).toBe(
        co2.perVisit(MILLION, true)
      );
      expect(co2.perVisitTrace(MILLION, true, {}).co2).toBe(
        co2.perVisit(MILLION, true)
      );
    });
  });

  describe("Using custom grid intensity", () => {
    const co2 = new CO2();
    it("uses the grid intensity data", () => {
      expect(
        co2.perVisitTrace(MILLION, false, {
          gridIntensity: {
            device: 565.629,
            dataCenter: { country: "TWN" },
          },
        }).co2
      ).toBeGreaterThan(0);

      expect(
        co2.perByteTrace(MILLION, false, {
          gridIntensity: {
            device: 565.629,
            dataCenter: { country: "TWN" },
            network: { country: "TWN" },
          },
        }).co2
      ).toBeGreaterThan(0);
    });
  });

  describe("Custom device intensity", () => {
    const {
      MILLION_PERVISIT_GREY_DEVICE_GRID_INTENSITY_CHANGE,
      MILLION_PERBYTE_GREY_DEVICE_GRID_INTENSITY_CHANGE,
      MILLION_GREY,
      MILLION_PERVISIT_GREY,
    } = SWD;
    const co2 = new CO2();
    it("expects an object or number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              gridIntensity: {
                device: "565.629",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);

      expect(
        parseFloat(
          co2
            .perByteTrace(1000000, false, {
              gridIntensity: {
                device: "565.629",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_GREY);
    });

    it("uses a number correctly", () => {
      expect(
        co2
          .perVisitTrace(MILLION, false, {
            gridIntensity: {
              device: 565.629,
            },
          })
          .co2.toPrecision(5)
      ).toBe(MILLION_PERVISIT_GREY_DEVICE_GRID_INTENSITY_CHANGE.toPrecision(5));

      expect(
        co2
          .perByteTrace(MILLION, false, {
            gridIntensity: {
              device: 565.629,
            },
          })
          .co2.toPrecision(5)
      ).toBe(MILLION_PERBYTE_GREY_DEVICE_GRID_INTENSITY_CHANGE.toPrecision(5));
    });

    it("uses an object correctly", () => {
      expect(
        co2
          .perVisitTrace(MILLION, false, {
            gridIntensity: {
              device: {
                country: "TWN",
              },
            },
          })
          .co2.toPrecision(5)
      ).toBe(MILLION_PERVISIT_GREY_DEVICE_GRID_INTENSITY_CHANGE.toPrecision(5));
      expect(
        co2
          .perByteTrace(MILLION, false, {
            gridIntensity: {
              device: {
                country: "TWN",
              },
            },
          })
          .co2.toPrecision(5)
      ).toBe(MILLION_PERBYTE_GREY_DEVICE_GRID_INTENSITY_CHANGE.toPrecision(5));
    });
  });

  describe("Custom data center intensity", () => {
    const {
      MILLION_PERVISIT_GREY_DATACENTER_GRID_INTENSITY_CHANGE,
      MILLION_PERBYTE_GREY_DATACENTER_GRID_INTENSITY_CHANGE,
      MILLION_GREY,
      MILLION_PERVISIT_GREY,
    } = SWD;
    const co2 = new CO2();
    it("expects an object or number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              gridIntensity: {
                dataCenter: "565.629",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        parseFloat(
          co2
            .perByteTrace(1000000, false, {
              gridIntensity: {
                dataCenter: "565.629",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_GREY);
    });

    it("uses a number correctly", () => {
      expect(
        co2
          .perVisitTrace(MILLION, false, {
            gridIntensity: {
              dataCenter: 565.629,
            },
          })
          .co2.toPrecision(5)
      ).toBe(
        MILLION_PERVISIT_GREY_DATACENTER_GRID_INTENSITY_CHANGE.toPrecision(5)
      );
      expect(
        co2
          .perByteTrace(MILLION, false, {
            gridIntensity: {
              dataCenter: 565.629,
            },
          })
          .co2.toPrecision(5)
      ).toBe(
        MILLION_PERBYTE_GREY_DATACENTER_GRID_INTENSITY_CHANGE.toPrecision(5)
      );
    });

    it("uses an object correctly", () => {
      expect(
        co2
          .perVisitTrace(MILLION, false, {
            gridIntensity: {
              dataCenter: {
                country: "TWN",
              },
            },
          })
          .co2.toPrecision(5)
      ).toBe(
        MILLION_PERVISIT_GREY_DATACENTER_GRID_INTENSITY_CHANGE.toPrecision(5)
      );
      expect(
        co2
          .perByteTrace(MILLION, false, {
            gridIntensity: {
              dataCenter: {
                country: "TWN",
              },
            },
          })
          .co2.toPrecision(5)
      ).toBe(
        MILLION_PERBYTE_GREY_DATACENTER_GRID_INTENSITY_CHANGE.toPrecision(5)
      );
    });
  });

  describe("Custom network intensity", () => {
    const {
      MILLION_PERVISIT_GREY_NETWORK_GRID_INTENSITY_CHANGE,
      MILLION_PERBYTE_GREY_NETWORK_GRID_INTENSITY_CHANGE,
      MILLION_GREY,
      MILLION_PERVISIT_GREY,
    } = SWD;
    const co2 = new CO2();
    it("expects an object or number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              gridIntensity: {
                network: "565.629",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);

      expect(
        parseFloat(
          co2
            .perByteTrace(1000000, false, {
              gridIntensity: {
                network: "565.629",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_GREY);
    });

    it("uses a number correctly", () => {
      expect(
        co2
          .perVisitTrace(MILLION, false, {
            gridIntensity: {
              network: 565.629,
            },
          })
          .co2.toPrecision(5)
      ).toBe(
        MILLION_PERVISIT_GREY_NETWORK_GRID_INTENSITY_CHANGE.toPrecision(5)
      );
      expect(
        co2
          .perByteTrace(MILLION, false, {
            gridIntensity: {
              network: 565.629,
            },
          })
          .co2.toPrecision(5)
      ).toBe(MILLION_PERBYTE_GREY_NETWORK_GRID_INTENSITY_CHANGE.toPrecision(5));
    });

    it("uses an object correctly", () => {
      expect(
        co2
          .perVisitTrace(MILLION, false, {
            gridIntensity: {
              network: {
                country: "TWN",
              },
            },
          })
          .co2.toPrecision(5)
      ).toBe(
        MILLION_PERVISIT_GREY_NETWORK_GRID_INTENSITY_CHANGE.toPrecision(5)
      );
      expect(
        co2
          .perByteTrace(MILLION, false, {
            gridIntensity: {
              network: {
                country: "TWN",
              },
            },
          })
          .co2.toPrecision(5)
      ).toBe(MILLION_PERBYTE_GREY_NETWORK_GRID_INTENSITY_CHANGE.toPrecision(5));
    });
  });

  describe("Using custom caching values in SWD", () => {
    const { MILLION_PERVISIT_GREY } = SWD;
    const co2 = new CO2();
    it("uses the custom value", () => {
      expect(
        co2.perVisitTrace(1000000, false, {
          dataReloadRatio: 0.5,
        }).co2
      ).toBeGreaterThan(MILLION_PERVISIT_GREY);
    });

    it("expects a number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, { dataReloadRatio: "0.5" })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
    });

    it("expects a number between 0 and 1", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              dataReloadRatio: 1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              dataReloadRatio: -1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        co2.perVisitTrace(1000000, false, {
          dataReloadRatio: 0,
        }).co2
      ).toBeLessThan(MILLION_PERVISIT_GREY);
    });
  });

  describe("Using custom first and return visitor figures in SWD", () => {
    const { MILLION_PERVISIT_GREY, MILLION_GREY } = SWD;
    const co2 = new CO2();

    it("uses the custom values", () => {
      expect(
        co2.perVisitTrace(MILLION, false, {
          firstVisitPercentage: 0.8,
          returnVisitPercentage: 0.2,
        }).co2
      ).toBeGreaterThan(MILLION_PERVISIT_GREY);

      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              firstVisitPercentage: 0.8,
              returnVisitPercentage: 0.2,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_GREY);
    });

    it("expects firstVisitPercentage to be a number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              firstVisitPercentage: "0.8",
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
    });
    it("expects firstVisitPercentage to be a number between 0 and 1", () => {
      const co2 = new CO2();
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              firstVisitPercentage: 1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              firstVisitPercentage: -1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        co2.perVisitTrace(1000000, false, {
          firstVisitPercentage: 0,
        }).co2
      ).toBeLessThan(MILLION_PERVISIT_GREY);
    });
    it("expects returnVisitPercentage to be a number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              returnVisitPercentage: "0.5",
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
    });
    it("expects returnVisitPercentage to be a number between 0 and 1", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              returnVisitPercentage: 1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              returnVisitPercentage: -1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBe(MILLION_PERVISIT_GREY);
      expect(
        co2.perVisitTrace(1000000, false, {
          returnVisitPercentage: 0,
        }).co2
      ).toBeLessThan(MILLION_PERVISIT_GREY);
    });
  });
});
