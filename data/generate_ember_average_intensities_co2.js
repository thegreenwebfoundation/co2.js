const fs = require("fs");
const csv = fs.readFileSync("data/co2-intensities-ember-2021.csv");

const countries = fs.readFileSync("data/fixtures/countries.csv");

const getHeaders = (string) => {
	return string.split(",")
}

const array = csv.toString().split("\n");
const countriesRows = countries.toString().split("\n");
const countryArray = [];

const countryHeaders = getHeaders(countriesRows[0]);
for (let i = 1; i < countriesRows.length; i++) {
	const countryObject = {};
	const currentArrayString = countriesRows[i]
	let string = '';
	let quoteFlag = 0;

	for (let character of currentArrayString) {
		if (character === '"' && quoteFlag === 0) {
			quoteFlag = 1
		} else if (character === '"' && quoteFlag == 1) quoteFlag = 0
		if (character === ',' && quoteFlag === 0) character = '|'
		if (character !== '"') string += character
	}

	let jsonProperties = string.split("|")

	for (let j in countryHeaders) {
		countryObject[countryHeaders[j].replace("\r", "")] = jsonProperties[j].replace("\r", "")
	}

	countryArray.push(countryObject)
}

/* Store the converted result into an array */
const csvToJsonResult = {};
const gridIntensityResults = {}

/* Store the CSV column headers into seprate variable */
const headers = getHeaders(array[0]);

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

	const countryCodes = countryArray.find(findCountry => {
		if (findCountry.country_name.toLowerCase() === jsonProperties[1].toLowerCase()) {
			const { country_code_iso_2, country_code_iso_3 } = findCountry;
			return { country_code_iso_2, country_code_iso_3 }
		}
	})
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

// TODO: Include 2 & 3 digit ISO country codes in output.