const fs = require("fs");
const csv = fs.readFileSync("data/co2-intensities-ember-2021.csv");
const getHeaders = require("./utils/getCSVHeaders");
const mapCountries = require("./utils/mapCountries");
const getCountryCodes = require("./utils/getCountryCodes");

const countries = mapCountries();
const array = csv.toString().split("\n");

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {};

/* Store the CSV column headers into separate variable */
const headers = getHeaders(array[0]);

/* Iterate over the remaining data rows */
for (let currentArrayString of array) {
	// If there's an empty line, keep calm and carry on.
	// Also, skip the first row since those are the headers.
	if (currentArrayString.length === 0 || currentArrayString === array[0]) continue;

	/* Empty object to store result in key value pair */
	const jsonObject = {}

	/* Store the current array element */
	let string = ''
	let quoteFlag = 0

	// Iterate over the current array element and generate a string
	for (let character of currentArrayString) {


		// The next set of if statements helps setup the current array element to be split by columns (comma delimited)
		// However, some textual cells may contain commas, so we need to check for those and ignore them.
		// We do this by looking for textual cells that are enclosed in double quotes, and setting the quoteFlag to 1 when we encounter one.
		if (character === '"' && quoteFlag === 0) {
			quoteFlag = 1
		} else if (character === '"' && quoteFlag == 1) {
			quoteFlag = 0
		}

		// If we encounter a comma, and the quoteFlag is 0, then we know that we have reached the end of a column. We replace the comma with a pipe character to help us split the string later.
		if (character === ',' && quoteFlag === 0) character = '|'
		if (character !== '"') string += character
	}

	// Split the string by the pipe character
	let jsonProperties = string.split("|")

	// Ember sets the country value (3-digit country code) in the first column. If data is for a region instead, it will be in the second column.
	// We can assign the current country (or region) by using these fields.
	let country = jsonProperties[0] || jsonProperties[1];

	// Loop through the headers and assign the values to the JSON object
	for (let column in headers) {
		// First check if the current property is an array string. If so, then we'll split it and map the results to an array.
		// We trim the values to remove any whitespace.
		if (jsonProperties[column].includes(",")) {
			jsonObject[headers[column]] = jsonProperties[column]
				.split(",").map(item => item.trim());
		} else {
			// Otherwise, just assign the value to the JSON object.
			// We replace \r with an empty string to remove any carriage returns.
			jsonObject[headers[column].replace("\r", "")] = jsonProperties[column].replace("\r", "")
		}

		// This extracts only the emissions intensity data from the CSV.
		// We use this to generate a smaller data file which can be later imported into CO2.js
		if (headers[column].startsWith('emissions_intensity_gco2_per_kwh')) {
			gridIntensityResults[country.toLowerCase()] = jsonProperties[column].replace("\r", "")
		}
	}

	// Ember keeps the country name in the 2nd column, so we'll use that to map the ISO country codes
	const countryCodes = getCountryCodes(jsonProperties[1].toLowerCase());

	/* Push the genearted JSON object to resultant array */	
	csvToJsonResult[country] = {...jsonObject, ...countryCodes};
}
/* Convert the final array to JSON */
const json = JSON.stringify(csvToJsonResult);
const gridIntensityJson = JSON.stringify(gridIntensityResults);

// This saves the country code and emissions data only, for use in the CO2.js library
fs.writeFileSync("data/average-intensities-ember-2021.js", `module.exports = ${gridIntensityJson}`);

// This saves the full data set as a JSON file for reference.
fs.writeFileSync("data/average-intensities-ember-2021.json", json);