const fs = require("fs");
const csv = fs.readFileSync("data/co2-intensities-ember-2021.csv");
const parseCSVRow = require("../utils/parseCSVRow");
const getCountryCodes = require("../utils/getCountryCodes");
const type = "average";
const source = "Ember";
const year = "2021";

const array = csv.toString().split("\n");

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {};

/* Store the CSV column headers into separate variable */
const headers = parseCSVRow(array[0]);

/* Iterate over the remaining data rows */
for (let currentArrayString of array) {
  // If there's an empty line, keep calm and carry on.
  // Also, skip the first row since those are the headers.
  if (currentArrayString.length === 0 || currentArrayString === array[0])
    continue;

  /* Empty object to store result in key value pair */
  const jsonObject = {};

  // Split the string by the pipe character
  let jsonProperties = parseCSVRow(currentArrayString);

  // Ember sets the country value (3-digit country code) in the first column. If data is for a region instead, it will be in the second column.
  // We can assign the current country (or region) by using these fields.
  let country = jsonProperties[0] || jsonProperties[1];

  // Loop through the headers and assign the values to the JSON object
  for (let column in headers) {
    // First check if the current property is an array string. If so, then we'll split it and map the results to an array.
    // We trim the values to remove any whitespace.
    if (jsonProperties[column].includes(",")) {
      jsonObject[headers[column]] = jsonProperties[column]
        .split(",")
        .map((item) => item.trim());
    } else {
      // Otherwise, just assign the value to the JSON object.
      // We replace \r with an empty string to remove any carriage returns.
      jsonObject[headers[column].replace("\r", "")] = jsonProperties[
        column
      ].replace("\r", "");
    }

    // This extracts only the emissions intensity data from the CSV.
    // We use this to generate a smaller data file which can be later imported into CO2.js
    if (headers[column].startsWith("emissions_intensity_gco2_per_kwh")) {
      gridIntensityResults[country.toUpperCase()] = jsonProperties[
        column
      ].replace("\r", "");
    }
  }

  // Ember keeps the country name in the 2nd column, so we'll use that to map the ISO country codes
  const countryCodes = getCountryCodes(
    "ember_country_name",
    jsonProperties[1].toLowerCase()
  );

  /* Push the genearted JSON object to resultant array */
  csvToJsonResult[country] = { ...jsonObject, ...countryCodes };
}
/* Convert the final array to JSON */
const json = JSON.stringify(csvToJsonResult);
const gridIntensityJson = JSON.stringify(gridIntensityResults);

// This saves the country code and emissions data only, for use in the CO2.js library
fs.writeFileSync(
  "data/output/average-intensities-2021.js",
  `const data = ${gridIntensityJson}; 
const type = "${type}";
const year = "${year}";
export { data, type, year }; 
export default { data, type, year };`
);
// Save a minified version to the src folder so that it can be easily imported into the library
fs.writeFileSync(
  "src/data/average-intensities-2021.min.js",
  `const data = ${gridIntensityJson}; const type = "${type}"; const year = "${year}"; export { data, type, year }; export default { data, type, year };`
);

// This saves the full data set as a JSON file for reference.
fs.writeFileSync("data/output/average-intensities-2021.json", json);
