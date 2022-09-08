const getCountryCodes = (countries, country) => {
    return countries.find(findCountry => {
		if (findCountry.country_name.toLowerCase() === country) {
			const { country_code_iso_2, country_code_iso_3 } = findCountry;
			return { country_code_iso_2, country_code_iso_3 }
		}
	})
}

module.exports = getCountryCodes;