"use strict";

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(join(process.cwd(), "package.json"));
const parseCSVRow = require("./data/utils/parseCSVRow.js");

function legacyParseCSVRow(currentArrayString) {
  let string = "";
  let quoteFlag = 0;

  for (let character of currentArrayString) {
    if (character === '"' && quoteFlag === 0) {
      quoteFlag = 1;
    } else if (character === '"' && quoteFlag === 1) {
      quoteFlag = 0;
    }

    if (character === "," && quoteFlag === 0) character = "|";
    if (character !== '"') string += character;
  }

  return string.split("|");
}

const checkedInRows = [
  "data/fixtures/countries.csv",
  "data/IFI_Default_Grid_Factors_2021_v3.1_unfccc.csv",
];

describe("parseCSVRow", () => {
  it("keeps a pipe inside a field", () => {
    expect(parseCSVRow("a|b,c")).toEqual(["a|b", "c"]);
    expect(parseCSVRow('"a|b",c')).toEqual(["a|b", "c"]);
    expect(legacyParseCSVRow("a|b,c")).toEqual(["a", "b", "c"]);
  });

  it("keeps a comma inside quotes and a doubled quote as one quote", () => {
    expect(parseCSVRow('"a,b",c')).toEqual(["a,b", "c"]);
    expect(parseCSVRow('a,"b""c",d')).toEqual(["a", 'b"c', "d"]);
  });

  it("returns one empty field for an empty row", () => {
    expect(parseCSVRow("")).toEqual([""]);
  });

  it("parses the checked-in generator rows the same way as the pipe splitter", () => {
    for (const file of checkedInRows) {
      const lines = readFileSync(file, "utf8").split("\n");

      lines.forEach((line) => {
        expect(parseCSVRow(line)).toEqual(legacyParseCSVRow(line));
      });
    }
  });
});
