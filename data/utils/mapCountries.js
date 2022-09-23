/**
 * Generates an array of objects from the countries.csv file.
 * @returns {array} - Returns an array of objects.
 */

const fs = require("fs");
const parseCSVRow = require("./parseCSVRow");
const countries = fs.readFileSync("data/fixtures/countries.csv");

const countryArray = [];

const countriesRows = countries.toString().split("\n");

const countryHeaders = parseCSVRow(countriesRows[0]);

const mapCountries = () => {
    for (let i = 1; i < countriesRows.length; i++) {
        const countryObject = {};
        const currentArrayString = countriesRows[i]
        
        if (currentArrayString.length === 0 || currentArrayString === countriesRows[0]) continue;
    
        let jsonProperties = parseCSVRow(currentArrayString)
    
        for (let column in countryHeaders) {
            if (!column || column === "") continue;
            countryObject[countryHeaders[column].replace("\r", "")] = jsonProperties[column].replace("\r", "")
        }
    
        countryArray.push(countryObject)
    }

    return countryArray;
}

module.exports = mapCountries;