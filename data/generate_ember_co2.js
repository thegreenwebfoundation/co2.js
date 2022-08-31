const fs = require("fs");
let csv = fs.readFileSync("data/co2-intensities-ember-2021.csv");

const array = csv.toString().split("\n");

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {}

/* Store the CSV column headers into seprate variable */
const headers = array[0].split(",");

/* Iterate over the remaining data rows */
for (let i = 1; i < array.length - 1; i++) {
	/* Empty object to store result in key value pair */
	const jsonObject = {}
	/* Store the current array element */
	const currentArrayString = array[i]
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

		if (headers[j].startsWith('emissions_intensity_gco2_per_kwh')) {
			gridIntensityResults[country.toLowerCase()] = jsonProperties[j].replace("\r", "")
		}
	}
	/* Push the genearted JSON object to resultant array */	
	csvToJsonResult[country] = jsonObject;
}
/* Convert the final array to JSON */
const json = JSON.stringify(csvToJsonResult);
const gridIntensityJson = JSON.stringify(gridIntensityResults);

// This saves the country code and emissions data only, for use in the CO2.js library
fs.writeFileSync("data/intensities-ember-2021.js", `module.exports = ${gridIntensityJson}`);

// This saves the full data set as a JSON file for reference.
fs.writeFileSync("data/intensities-ember-2021.json", json);