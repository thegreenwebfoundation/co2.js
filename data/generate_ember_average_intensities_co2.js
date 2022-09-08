const fs = require("fs");
const csv = fs.readFileSync("data/co2-intensities-ember-2021.csv");
const getHeaders = require("./utils/getCSVHeaders");
const mapCountries = require("./utils/mapCountries");
const getCountryCodes = require("./utils/getCountryCodes");

const countries = mapCountries();
const array = csv.toString().split("\n");

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {}

/* Store the CSV column headers into seprate variable */
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
	for (let character of currentArrayString) {
		if (character === '"' && quoteFlag === 0) {
			quoteFlag = 1
		} else if (character === '"' && quoteFlag == 1) quoteFlag = 0
		if (character === ',' && quoteFlag === 0) character = '|'
		if (character !== '"') string += character
	}

	let jsonProperties = string.split("|")
	let country = jsonProperties[0] || jsonProperties[1];

	for (let j in headers) {
		if (jsonProperties[j].includes(",")) {
			jsonObject[headers[j]] = jsonProperties[j]
				.split(",").map(item => item.trim());
		} else {
			jsonObject[headers[j].replace("\r", "")] = jsonProperties[j].replace("\r", "")
		}

		// This extracts only the emissions intensity data from the CSV.
		// We use this to generate a smaller data file which can be later imported into CO2.js
		if (headers[j].startsWith('emissions_intensity_gco2_per_kwh')) {
			gridIntensityResults[country.toLowerCase()] = jsonProperties[j].replace("\r", "")
		}
	}

	// Ember keeps the country name in the 2nd column, so we'll use that to map the ISO country codes
	const countryCodes = getCountryCodes(countries, jsonProperties[1].toLowerCase());

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