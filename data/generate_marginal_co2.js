const fs = require("fs");
let csv = fs.readFileSync("data/IFI_Default_Grid_Factors_2021_v3.1_unfccc.csv");

const array = csv.toString().split("\n");

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {};

/* Store the CSV column headers into seprate variable */
const headers = [
  array[4].split(",").filter((item) => item !== ""),
  array[3].split(',"').filter((item) => item !== ""),
].flat();

headers.push("Operating Margin Grid Emission");

/* Iterate over the remaining data rows */
for (let i = 5; i < array.length - 8; i++) {
  /* Empty object to store result in key value pair */
  const jsonObject = {};
  /* Store the current array element */
  const currentArrayString = array[i];
  let string = "";
  let quoteFlag = 0;
  for (let character of currentArrayString) {
    if (character === '"' && quoteFlag === 0) {
      quoteFlag = 1;
    } else if (character === '"' && quoteFlag == 1) quoteFlag = 0;
    if (character === "," && quoteFlag === 0) character = "|";
    if (character !== '"') string += character;
  }

  let jsonProperties = string.split("|");
  let country = jsonProperties[0];
  console.log(country, jsonProperties);

  if (!country || country === "") continue;

  for (let j in headers) {
    if (jsonProperties[j].includes(",")) {
      jsonObject[headers[j]] = jsonProperties[j]
        .split(",")
        .map((item) => item.trim());
    } else {
      jsonObject[headers[j].replace("\r", "").replaceAll('\"', "")] =
        jsonProperties[j].replace("\r", "").replace('\"', "");
    }

    if (headers[j].startsWith("Operating Margin Grid Emission")) {
      gridIntensityResults[country.toLowerCase()] = jsonProperties[j]
        .replace("\r", "")
        .replace('\"', "");
    }
  }
  /* Push the genearted JSON object to resultant array */
  csvToJsonResult[country] = jsonObject;
}
/* Convert the final array to JSON */
const json = JSON.stringify(csvToJsonResult);
const gridIntensityJson = JSON.stringify(gridIntensityResults);

// This saves the country code and emissions data only, for use in the CO2.js library
fs.writeFileSync(
  "data/marginal-intensities-unfccc-2021.js",
  `module.exports = ${gridIntensityJson}`
);

// This saves the full data set as a JSON file for reference.
fs.writeFileSync("data/marginal-intensities-unfccc-2021.json", json);

// TODO: Include 2 & 3 digit ISO country codes in output.
