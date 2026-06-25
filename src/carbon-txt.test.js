import check from "./carbon-txt.js";

// Mock fetch to avoid actual API calls during testing
process.env.CO2JS_VERSION = "1.2.34";
global.fetch = jest.fn();

const apiKey = "abc123";

describe("carbon-txt.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requires a valid API key", () => {
    it("should throw an error if no API key is provided", async () => {
      await expect(check("example.com")).rejects.toThrow(
        "A valid API key is required."
      );
    });

    it("sends the API key in the request headers", async () => {
      await check("example.com", { apiKey });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 ", "x-api-key": "abc123" },
        })
      );
    });
  });

  describe("should validate a single domain", () => {
    const mockSuccessResponse = {
      success: true,
      url: "https://example.com/carbon.txt",
      delegation_method: null,
      data: {
        version: "0.4",
        last_updated: "2026-03-09",
        upstream: {
          services: [
            {
              domain: "www.example.com",
              name: null,
              service_type: "cdn",
            },
          ],
        },
        org: {
          disclosures: [
            {
              doc_type: "web-page",
              url: "https://www.sampledoc.com/disclosure",
              domain: null,
              valid_until: null,
              title: "A sample disclosure",
            },
          ],
        },
      },
      document_data: {},
      logs: [
        "Attempting to resolve domain: example.com",
        "Trying a DNS delegated lookup for domain example.com",
        "Checking if a carbon.txt file is reachable at https://example.com/carbon.txt",
        "New Carbon text file found at: https://example.com/carbon.txt",
        "Carbon.txt file parsed as valid TOML.",
      ],
    };

    const mockFailResponse = {
      success: false,
      url: null,
      delegation_method: null,
      errors: [
        "NotParseableTOMLButHTML: Invalid statement (at line 1, column 1)",
      ],
      logs: [
        "Attempting to resolve domain: fershad.com",
        "Trying a DNS delegated lookup for domain example.com",
        "Checking if a carbon.txt file is reachable at https://example.com/carbon.txt",
        "New Carbon text file found at: https://example.com/carbon.txt",
        "TOML parsing failed.",
      ],
    };

    const mockInvalidDomainReponse = {
      detail: [
        {
          type: "domain_format",
          loc: ["body", "carbon_txt_domain_data", "domain"],
          msg: "Invalid domain format",
        },
      ],
    };

    it("returns successful response without verbose", async () => {
      // Mock fetch to return the response
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      });

      const result = await check("example.com", { apiKey });

      expect(result).toEqual({
        success: true,
        url: "https://example.com/carbon.txt",
        org: {
          disclosures: [
            {
              doc_type: "web-page",
              url: "https://www.sampledoc.com/disclosure",
              domain: null,
              valid_until: null,
              title: "A sample disclosure",
            },
          ],
        },
        upstream: {
          services: [
            {
              domain: "www.example.com",
              name: null,
              service_type: "cdn",
            },
          ],
        },
      });
    });

    it("returns successful response with verbose", async () => {
      // Mock fetch to return the response
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      });

      const result = await check("example.com", { verbose: true, apiKey });

      expect(result).toEqual(mockSuccessResponse);
    });

    it("returns a failed response without verbose set", async () => {
      // Mock fetch to return a failed response
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockFailResponse),
      });

      const result = await check("example.com", { apiKey });

      expect(result).toEqual({
        success: false,
        errors: [
          "NotParseableTOMLButHTML: Invalid statement (at line 1, column 1)",
        ],
      });
    });

    it("returns a failed response with verbose set", async () => {
      // Mock fetch to return a failed response
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockFailResponse),
      });

      const result = await check("example.com", { verbose: true, apiKey });

      expect(result).toEqual(mockFailResponse);
    });

    it("fails gracefully when invalid domain is sent to the API", async () => {
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockInvalidDomainReponse),
      });

      const result = await check("https://example.com", { apiKey });

      expect(result).toEqual({
        success: false,
        errors: ["Invalid domain format"],
      });
    });
  });

  describe("should throw error if", () => {
    it("invalid domain is provided", async () => {
      await expect(check(null, { apiKey })).rejects.toThrow();
      await expect(check(undefined, { apiKey })).rejects.toThrow();
      await expect(check(123, { apiKey })).rejects.toThrow();
    });
  });

  describe("it sends the correct user agent", () => {
    it("sends the correct user agent when none is set", async () => {
      await check("example.com", { apiKey });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 ", "x-api-key": "abc123" },
        })
      );
    });

    it("sends the correct user agent when one is set", async () => {
      await check("example.com", { userAgentIdentifier: "test-agent", apiKey });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "User-Agent": "co2js/1.2.34 test-agent",
            "x-api-key": "abc123",
          },
        })
      );
    });
  });

  describe("it accepts an options object", () => {
    it("accepts a verbose option", async () => {
      await check("example.com", { verbose: true, apiKey });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("accepts a user agent identifier option", async () => {
      await check("example.com", { userAgentIdentifier: "test-agent", apiKey });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "User-Agent": "co2js/1.2.34 test-agent",
            "x-api-key": "abc123",
          },
        })
      );
    });

    it("accepts a custom url", async () => {
      await check("example.com", {
        customValidator: "https://mycarbontxtvalidator.com",
        apiKey,
      });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenLastCalledWith(
        "https://mycarbontxtvalidator.com",
        expect.objectContaining({
          headers: { "User-Agent": "co2js/1.2.34 ", "x-api-key": "abc123" },
          method: "POST",
        })
      );
    });
  });
});
