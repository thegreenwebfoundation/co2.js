"use strict";

import { MILLION, SWDV3 } from "./constants/test-constants.js";

import CO2 from "./co2.js";
import { averageIntensity, marginalIntensity } from "./index.js";
import { SWDV4 } from "./constants/index.js";

const TwnGridIntensityValue = averageIntensity.data["TWN"];
const SWDM4_GLOBAL_GRID_INTENSITY = SWDV4.GLOBAL_GRID_INTENSITY;

describe("co2", () => {
  let co2;

  describe("Sustainable Web Design model as simple option", () => {
    // the SWD model should have slightly higher values as
    // we include more of the system in calculations for the
    // same levels of data transfer

    const { MILLION_PERVISIT_GREY, MILLION_PERVISIT_GREEN } = SWDV3;

    // We're not passing in a model parameter here to check that SWD is used by default
    beforeEach(() => {
      co2 = new CO2();
    });

    describe("perVisit", () => {
      it("returns a CO2 number for data transfer per visit with caching assumptions from the Sustainable Web Design model", () => {
        co2.perVisit(MILLION);
        expect(parseFloat(co2.perVisit(MILLION).toFixed(5))).toBeCloseTo(
          parseFloat(MILLION_PERVISIT_GREY.toFixed(5)),
          3
        );
      });

      it("returns a lower CO2 number for data transfer from domains using entirely 'green' power", () => {
        expect(parseFloat(co2.perVisit(MILLION, false).toFixed(5))).toBeCloseTo(
          parseFloat(MILLION_PERVISIT_GREY.toFixed(5)),
          3
        );

        expect(parseFloat(co2.perVisit(MILLION, true).toFixed(5))).toBeCloseTo(
          parseFloat(MILLION_PERVISIT_GREEN.toFixed(5)),
          3
        );
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
      } = SWDV3;
      describe("perVisit", () => {
        it("returns an object with devices, networks, data centers, and production emissions shown separately, as well as the total emissions", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perVisit(MILLION);
          expect(
            parseFloat(res["consumerDeviceCO2 - first"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_DEVICES_FIRST.toFixed(5))
          );
          expect(parseFloat(res["networkCO2 - first"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_NETWORKS_FIRST.toFixed(5))
          );
          expect(
            parseFloat(res["dataCenterCO2 - first"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_DATACENTERS_FIRST.toFixed(5))
          );
          expect(
            parseFloat(res["productionCO2 - first"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_PRODUCTION_FIRST.toFixed(5))
          );
          expect(
            parseFloat(res["consumerDeviceCO2 - subsequent"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_DEVICES_SECOND.toFixed(5))
          );
          expect(
            parseFloat(res["networkCO2 - subsequent"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_NETWORKS_SECOND.toFixed(5))
          );
          expect(
            parseFloat(res["dataCenterCO2 - subsequent"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_DATACENTERS_SECOND.toFixed(5))
          );
          expect(
            parseFloat(res["productionCO2 - subsequent"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_PRODUCTION_SECOND.toFixed(5))
          );
          expect(parseFloat(res.total.toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY.toFixed(5)),
            3
          );
        });
        it("returns adjusted data center and total emissions for when green, other values remain the same as grey", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perVisit(MILLION, true);
          // Since the data center emissions are the only ones that change, we can just check those
          // and the total. To check the rest stay the same as grey, we can just check the device results.
          expect(
            parseFloat(res["consumerDeviceCO2 - first"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_DEVICES_FIRST.toFixed(5)),
            3
          );

          expect(
            parseFloat(res["dataCenterCO2 - first"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREEN_DATACENTERS_FIRST.toFixed(5)),
            3
          );

          expect(
            parseFloat(res["consumerDeviceCO2 - subsequent"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREY_DEVICES_SECOND.toFixed(5)),
            3
          );
          expect(
            parseFloat(res["dataCenterCO2 - subsequent"].toFixed(5))
          ).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREEN_DATACENTERS_SECOND.toFixed(5)),
            3
          );

          expect(parseFloat(res.total.toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_PERVISIT_GREEN.toFixed(5)),
            3
          );
        });
      });
      describe("perByte", () => {
        it("returns adjusted data center and total emissions for when green, other values remain the same as grey", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perByte(MILLION, true);
          expect(parseFloat(res["consumerDeviceCO2"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREY_DEVICES.toFixed(5)),
            3
          );
          expect(parseFloat(res["dataCenterCO2"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREEN_DATACENTERS.toFixed(5)),
            3
          );
          expect(parseFloat(res.total.toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREEN.toFixed(5)),
            3
          );
        });
        it("returns an object with devices, networks, data centers, and production emissions shown separately, as well as the total emissions", () => {
          co2 = new CO2({ results: "segment" });
          const res = co2.perByte(MILLION);
          expect(parseFloat(res["consumerDeviceCO2"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREY_DEVICES.toFixed(5)),
            3
          );
          expect(parseFloat(res["networkCO2"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREY_NETWORKS.toFixed(5)),
            3
          );
          expect(parseFloat(res["dataCenterCO2"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREY_DATACENTERS.toFixed(5)),
            3
          );
          expect(parseFloat(res["productionCO2"].toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREY_PRODUCTION.toFixed(5)),
            3
          );
          expect(parseFloat(res.total.toFixed(5))).toBeCloseTo(
            parseFloat(MILLION_GREY.toFixed(5)),
            3
          );
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

    it("throws an error if using the rating system with OneByte", () => {
      expect(() => {
        co2 = new CO2({ model: "1byte", rating: true });
      }).toThrowError(
        `The rating system is not supported in the model you are using. Try using the Sustainable Web Design model instead.\nSee https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`
      );
    });

    it("throws an error if the rating parameter is not a boolean", () => {
      expect(() => {
        co2 = new CO2({ rating: "false" });
      }).toThrowError(
        `The rating option must be a boolean. Please use true or false.\nSee https://developers.thegreenwebfoundation.org/co2js/options/ to learn more about the options available in CO2.js.`
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
            device: 678.87,
            dataCenter: { country: "TWN" },
          },
        }).co2
      ).toBeGreaterThan(0);

      expect(
        co2.perByteTrace(MILLION, false, {
          gridIntensity: {
            device: 678.87,
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
    } = SWDV3;
    const co2 = new CO2();
    it("expects an object or number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              gridIntensity: {
                device: "561",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERVISIT_GREY, 3);

      expect(
        parseFloat(
          co2
            .perByteTrace(1000000, false, {
              gridIntensity: {
                device: "561",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_GREY, 3);
    });

    it("uses a number correctly", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(MILLION, false, {
              gridIntensity: {
                device: TwnGridIntensityValue,
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(
        parseFloat(
          MILLION_PERVISIT_GREY_DEVICE_GRID_INTENSITY_CHANGE.toPrecision(5)
        ),
        3
      );

      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              gridIntensity: {
                device: TwnGridIntensityValue,
              },
            })
            .co2.toPrecision(4)
        )
      ).toBeCloseTo(
        parseFloat(
          MILLION_PERBYTE_GREY_DEVICE_GRID_INTENSITY_CHANGE.toPrecision(4)
        ),
        3
      );
    });

    it("uses an object correctly", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(MILLION, false, {
              gridIntensity: {
                device: {
                  country: "TWN",
                },
              },
            })
            .co2.toFixed(5)
        )
      ).toBeCloseTo(MILLION_PERVISIT_GREY_DEVICE_GRID_INTENSITY_CHANGE, 3);
      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              gridIntensity: {
                device: {
                  country: "TWN",
                },
              },
            })
            .co2.toPrecision(4)
        )
      ).toBeCloseTo(MILLION_PERBYTE_GREY_DEVICE_GRID_INTENSITY_CHANGE, 3);
    });
  });

  describe("Custom data center intensity", () => {
    const {
      MILLION_PERVISIT_GREY_DATACENTER_GRID_INTENSITY_CHANGE,
      MILLION_PERBYTE_GREY_DATACENTER_GRID_INTENSITY_CHANGE,
      MILLION_GREY,
      MILLION_PERVISIT_GREY,
    } = SWDV3;
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
      ).toBeCloseTo(MILLION_PERVISIT_GREY, 3);
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
      ).toBeCloseTo(MILLION_GREY, 3);
    });

    it("uses a number correctly", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(MILLION, false, {
              gridIntensity: {
                dataCenter: TwnGridIntensityValue,
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(
        parseFloat(
          MILLION_PERVISIT_GREY_DATACENTER_GRID_INTENSITY_CHANGE.toPrecision(5)
        ),
        3
      );
      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              gridIntensity: {
                dataCenter: TwnGridIntensityValue,
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(
        parseFloat(
          MILLION_PERBYTE_GREY_DATACENTER_GRID_INTENSITY_CHANGE.toPrecision(5)
        ),
        3
      );
    });

    it("uses an object correctly", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(MILLION, false, {
              gridIntensity: {
                dataCenter: {
                  country: "TWN",
                },
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERVISIT_GREY_DATACENTER_GRID_INTENSITY_CHANGE, 3);
      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              gridIntensity: {
                dataCenter: {
                  country: "TWN",
                },
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERBYTE_GREY_DATACENTER_GRID_INTENSITY_CHANGE, 3);
    });
  });

  describe("Custom network intensity", () => {
    const {
      MILLION_PERVISIT_GREY_NETWORK_GRID_INTENSITY_CHANGE,
      MILLION_PERBYTE_GREY_NETWORK_GRID_INTENSITY_CHANGE,
      MILLION_GREY,
      MILLION_PERVISIT_GREY,
    } = SWDV3;
    const co2 = new CO2();
    it("expects an object or number", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              gridIntensity: {
                network: "561",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERVISIT_GREY, 3);

      expect(
        parseFloat(
          co2
            .perByteTrace(1000000, false, {
              gridIntensity: {
                network: "561",
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_GREY, 3);
    });

    it("uses a number correctly", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(MILLION, false, {
              gridIntensity: {
                network: TwnGridIntensityValue,
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(
        parseFloat(
          MILLION_PERVISIT_GREY_NETWORK_GRID_INTENSITY_CHANGE.toFixed(5)
        ),
        3
      );
      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              gridIntensity: {
                network: TwnGridIntensityValue,
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(
        parseFloat(
          MILLION_PERBYTE_GREY_NETWORK_GRID_INTENSITY_CHANGE.toPrecision(5)
        ),
        3
      );
    });

    it("uses an object correctly", () => {
      expect(
        parseFloat(
          co2
            .perVisitTrace(MILLION, false, {
              gridIntensity: {
                network: {
                  country: "TWN",
                },
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERVISIT_GREY_NETWORK_GRID_INTENSITY_CHANGE, 3);
      expect(
        parseFloat(
          co2
            .perByteTrace(MILLION, false, {
              gridIntensity: {
                network: {
                  country: "TWN",
                },
              },
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERBYTE_GREY_NETWORK_GRID_INTENSITY_CHANGE, 3);
    });
  });

  describe("Using custom caching values in SWD", () => {
    const { MILLION_PERVISIT_GREY } = SWDV3;
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
      ).toBeCloseTo(MILLION_PERVISIT_GREY, 3);
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
      ).toBeCloseTo(MILLION_PERVISIT_GREY, 3);
      expect(
        parseFloat(
          co2
            .perVisitTrace(1000000, false, {
              dataReloadRatio: -1.5,
            })
            .co2.toPrecision(5)
        )
      ).toBeCloseTo(MILLION_PERVISIT_GREY, 3);
      expect(
        co2.perVisitTrace(1000000, false, {
          dataReloadRatio: 0,
        }).co2
      ).toBeLessThan(MILLION_PERVISIT_GREY);
    });
  });

  describe("Using custom first and return visitor figures in SWD", () => {
    const { MILLION_PERVISIT_GREY, MILLION_GREY } = SWDV3;
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
      ).toBeCloseTo(MILLION_GREY, 3);
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

  describe("Using values equal to 0", () => {
    const co2 = new CO2({ results: "segment" });

    it("expects perByteTrace to support values equal to 0", () => {
      const perByteTraceResult = co2.perByteTrace(1000000, false, {
        gridIntensity: {
          dataCenter: 0,
          network: 0,
          device: 0,
        },
      });
      const { dataCenter, network, device } =
        perByteTraceResult.variables.gridIntensity;
      expect(dataCenter).toStrictEqual({ value: 0 });
      expect(network).toStrictEqual({ value: 0 });
      expect(device).toStrictEqual({ value: 0 });
    });

    it("expects perVisitTrace to support values equal to 0", () => {
      const perVisitTraceResult = co2.perVisitTrace(1000000, false, {
        dataReloadRatio: 0,
        returnVisitPercentage: 0,
        firstVisitPercentage: 0,
        gridIntensity: {
          dataCenter: 0,
          network: 0,
          device: 0,
        },
      });
      const { dataReloadRatio, firstVisitPercentage, returnVisitPercentage } =
        perVisitTraceResult.variables;
      const { dataCenter, network, device } =
        perVisitTraceResult.variables.gridIntensity;
      expect(dataReloadRatio).toBe(0);
      expect(firstVisitPercentage).toBe(0);
      expect(returnVisitPercentage).toBe(0);
      expect(dataCenter).toStrictEqual({ value: 0 });
      expect(network).toStrictEqual({ value: 0 });
      expect(device).toStrictEqual({ value: 0 });
    });
    it("expects perByteTrace segments to be 0 when grid intensity is 0", () => {
      const perByteTraceResult = co2.perByteTrace(1000000, false, {
        gridIntensity: {
          dataCenter: 0,
          network: 0,
          device: 0,
        },
      });
      const co2Result = perByteTraceResult.co2;
      // Less than 0.1 because there's still a small production component that's calculated
      expect(co2Result.total).toBeLessThan(0.1);
      expect(co2Result["dataCenterCO2"]).toBe(0);
      expect(co2Result["networkCO2"]).toBe(0);
      expect(co2Result["consumerDeviceCO2"]).toBe(0);
    });

    it("expects perVisitTrace segments to be 0 when grid intensity is 0", () => {
      const perVisitTraceResult = co2.perVisitTrace(1000000, false, {
        gridIntensity: {
          dataCenter: 0,
          network: 0,
          device: 0,
        },
      });
      const co2Result = perVisitTraceResult.co2;
      const { dataCenter, network, device } =
        perVisitTraceResult.variables.gridIntensity;
      // Less than 0.1 because there's still a small production component that's calculated
      expect(co2Result.total).toBeLessThan(0.1);
      expect(co2Result["dataCenterCO2 - first"]).toBe(0);
      expect(co2Result["networkCO2 - first"]).toBe(0);
      expect(co2Result["consumerDeviceCO2 - first"]).toBe(0);
      expect(co2Result["dataCenterCO2 - subsequent"]).toBe(0);
      expect(co2Result["networkCO2 - subsequent"]).toBe(0);
      expect(co2Result["consumerDeviceCO2 - subsequent"]).toBe(0);
    });

    it("expects perVisitTrace segments to be 0 when there are 0 first and returning visitors", () => {
      const perVisitTraceResult = co2.perVisitTrace(1000000, false, {
        firstVisitPercentage: 0,
        returnVisitPercentage: 0,
      });
      const co2Result = perVisitTraceResult.co2;
      // Less than 0.1 because there's still a small production component that's calculated
      expect(co2Result.total).toBe(0);
    });

    it("expects perVisitTrace subsequent segments to be 0 when returning visitors is 0", () => {
      const perVisitTraceResult = co2.perVisitTrace(1000000, false, {
        firstVisitPercentage: 100,
        returnVisitPercentage: 0,
      });
      const co2Result = perVisitTraceResult.co2;
      expect(co2Result["dataCenterCO2 - first"]).toBeGreaterThan(0);
      expect(co2Result["networkCO2 - first"]).toBeGreaterThan(0);
      expect(co2Result["consumerDeviceCO2 - first"]).toBeGreaterThan(0);
      expect(co2Result["dataCenterCO2 - subsequent"]).toBe(0);
      expect(co2Result["networkCO2 - subsequent"]).toBe(0);
      expect(co2Result["consumerDeviceCO2 - subsequent"]).toBe(0);
    });
    it("expects perVisitTrace subsequent segments to be 0 when data reload is 0", () => {
      const perVisitTraceResult = co2.perVisitTrace(1000000, false, {
        dataReloadRatio: 0,
      });
      const co2Result = perVisitTraceResult.co2;
      expect(co2Result["dataCenterCO2 - first"]).toBeGreaterThan(0);
      expect(co2Result["networkCO2 - first"]).toBeGreaterThan(0);
      expect(co2Result["consumerDeviceCO2 - first"]).toBeGreaterThan(0);
      expect(co2Result["dataCenterCO2 - subsequent"]).toBe(0);
      expect(co2Result["networkCO2 - subsequent"]).toBe(0);
      expect(co2Result["consumerDeviceCO2 - subsequent"]).toBe(0);
    });
  });

  describe("Returning SWD results with rating", () => {
    const co2NoRating = new CO2();
    const co2Rating = new CO2({ rating: true });
    const co2RatingSegmented = new CO2({ rating: true, results: "segment" });

    it("does not return a rating when rating is false", () => {
      expect(co2NoRating.perVisit(MILLION)).not.toHaveProperty("rating");
    });

    it("returns a rating when rating is true", () => {
      expect(co2Rating.perVisit(MILLION)).toHaveProperty("rating");
    });

    it("returns a rating when rating is true and results are segmented", () => {
      expect(co2RatingSegmented.perByte(MILLION)).toHaveProperty("rating");
      expect(co2RatingSegmented.perByte(MILLION)).toHaveProperty("networkCO2");
    });
  });

  describe("Switch versions of the Sustainable Web Design model", () => {
    const co2 = new CO2({ model: "swd" });
    const co2SWDV4 = new CO2({ model: "swd", version: 4 });

    it("uses the SWD model version 3 by default", () => {
      expect(co2.model.version).toBe(3);
    });

    it("uses the SWD model version 4 when specified", () => {
      expect(co2SWDV4.model.version).toBe(4);
    });
  });

  describe("Using the perByteTrace method in SWDM v4", () => {
    const co2 = new CO2({ model: "swd", version: 4 });
    it("returns the expected object", () => {
      const res = co2.perByteTrace(MILLION);
      expect(res).toHaveProperty("variables");
      expect(res).toHaveProperty("co2");
      expect(res).toHaveProperty("green");

      expect(res.variables).toHaveProperty("bytes");
      expect(res.variables).toHaveProperty("gridIntensity");
      expect(res.variables).toHaveProperty("greenHostingFactor");

      expect(res.variables.gridIntensity).toHaveProperty("device");
      expect(res.variables.gridIntensity).toHaveProperty("dataCenter");
      expect(res.variables.gridIntensity).toHaveProperty("network");

      expect(res.co2).toBeGreaterThan(0);
      expect(res.variables.greenHostingFactor).toBe(0);
      expect(res.green).toBe(false);
      expect(res.variables.gridIntensity.device.value).toBe(
        SWDM4_GLOBAL_GRID_INTENSITY
      );
      expect(res.variables.gridIntensity.dataCenter.value).toBe(
        SWDM4_GLOBAL_GRID_INTENSITY
      );
      expect(res.variables.gridIntensity.network.value).toBe(
        SWDM4_GLOBAL_GRID_INTENSITY
      );
    });
    it("returns the expected object when adjustments are made", () => {
      const res = co2.perByteTrace(MILLION, false, {
        gridIntensity: {
          dataCenter: 300,
          network: 200,
          device: { country: "TWN" },
        },
        greenHostingFactor: 0.5,
      });
      console.log(JSON.stringify(res, null, 2));

      expect(res.variables.greenHostingFactor).toBe(0.5);
      expect(res.green).toBe(false);
      expect(res.variables.gridIntensity.device.country).toBe("TWN");
      expect(res.variables.gridIntensity.dataCenter.value).toBe(300);
      expect(res.variables.gridIntensity.network.value).toBe(200);
    });
  });
});
