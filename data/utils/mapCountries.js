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

    return countryArray;
}

module.exports = mapCountries;