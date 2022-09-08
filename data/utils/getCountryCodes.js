const mapCountries = require("./mapCountries");
const countries = mapCountries();

// Search the countries array based on an input value. We run the search on the "country_name" property.
// If a match is found, we return the country code (2-digit and 3-digit).
const getCountryCodes = (input) => {
    return countries.find(country => {
		if (country.country_name.toLowerCase() === input) {
			const { country_code_iso_2, country_code_iso_3 } = input;
			return { country_code_iso_2, country_code_iso_3 }
		}
	})
}

module.exports = getCountryCodes;