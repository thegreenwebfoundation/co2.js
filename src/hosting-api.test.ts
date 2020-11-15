import * as hosting from "./hosting-api";

describe("hostingAPI", function() {
  describe("checking a single domain with #check", function() {
    it("using the API", async function() {
      const res = await hosting.check("google.com");
      expect(res).toEqual(true);
    });
  });
  describe("implicitly checking multiple domains with #check", function() {
    it("using the API", async function() {
      const res = await hosting.check(["google.com", "kochindustries.com"]);
      expect(res).toContain("google.com");
    });
  });
});
