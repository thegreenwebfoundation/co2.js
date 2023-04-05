const fs = require("fs");
const csv = fs.readFileSync(
  "data/IFI_Default_Grid_Factors_2021_v3.1_unfccc.csv"
);
const parseCSVRow = require("../utils/parseCSVRow");
const getCountryCodes = require("../utils/getCountryCodes");
const type = "marginal";
const source = "UNFCCC";
const year = "2021";

const array = csv.toString().split("\n");

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {};

/* Store the CSV column headers into seprate variable */
const rowHeaders = parseCSVRow(array[4]);
rowHeaders.push(...parseCSVRow(array[3]));
rowHeaders.push("Operating Margin Grid Emission");

const headers = rowHeaders.filter((header) => header !== "");

/* Iterate over the remaining data rows */
// Here we remove the first 5 items in the array, since these are the headings which we have already accounted for
for (let currentArrayString of array.slice(5)) {
  // If there's an empty line, keep calm and carry on.
  if (currentArrayString.length === 0) continue;

  /* Empty object to store result in key value pair */
  const jsonObject = {};

  // Split the string by the pipe character
  let jsonProperties = parseCSVRow(currentArrayString);

  if (jsonProperties.length < 2) continue;

  // The UNFCCC data sets the country value (full country name as string) in the first column, so we can extract that.
  let country = jsonProperties[0];

  // If there's no value for the country, then we can skip this row.
  if (!country || country === "") continue;

  // UNFCCC keeps the country name in the 1st column, so we'll use that to map the ISO country codes
  const countryCodes = getCountryCodes(
    "unfccc_country_name",
    country.toLowerCase()
  );

  // Loop through the headers and assign the values to the JSON object
  for (let column in headers) {
    if (!column || column === "") continue;

    // First check if the current property is an array string. If so, then we'll split it and map the results to an array.
    // We trim the values to remove any whitespace.
    if (jsonProperties[column].includes(",")) {
      jsonObject[headers[column]] = jsonProperties[column]
        .split(",")
        .map((item) => item.trim());
    } else {
      // Otherwise, just assign the value to the JSON object.
      // We replace \r with an empty string to remove any carriage returns.
      // We also remove any quotations in the strings.
      jsonObject[headers[column].replace("\r", "").replaceAll('"', "")] =
        jsonProperties[column].replace("\r", "").replace('"', "");
    }

    if (headers[column].startsWith("Operating Margin Grid Emission")) {
      gridIntensityResults[
        countryCodes?.country_code_iso_3.toUpperCase() || country?.toUpperCase()
      ] = jsonProperties[column].replace("\r", "").replace('"', "");
    }
  }

  /* Push the genearted JSON object to resultant array */
  csvToJsonResult[country] = { ...jsonObject, ...countryCodes };
}
/* Convert the final array to JSON */
const json = JSON.stringify(csvToJsonResult);
const gridIntensityJson = JSON.stringify(gridIntensityResults);

// This saves the country code and emissions data only, for use in the CO2.js library
fs.writeFileSync(
  "data/output/marginal-intensities-2021.js",
  `const data = ${gridIntensityJson}; 
  const type = "${type}";
const year = "${year}";
export { data, type, year }; 
export default { data, type, year };`
);
// Save a minified version to the src folder so that it can be easily imported into the library
fs.writeFileSync(
  "src/data/marginal-intensities-2021.min.js",
  `const data = ${gridIntensityJson}; const type = "${type}"; const year = "${year}"; export { data, type, year }; export default { data, type, year };`
);

// This saves the full data set as a JSON file for reference.
fs.writeFileSync("data/output/marginal-intensities-2021.json", json);
