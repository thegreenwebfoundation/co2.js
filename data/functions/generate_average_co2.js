const fs = require("fs");

// This URL from Ember returns ALL the data for the country_overview_yearly table
const sourceURL =
  "https://ember-data-api-scg3n.ondigitalocean.app/ember/country_overview_yearly.json?_sort=rowid&_shape=array";
const gridIntensityResults = {};
const generalResults = {};
const type = "average";

/**
 * This function generates the average CO2 emissions data for each country.
 * It reads the data from the Ember API and saves it in the data/output folder.
 * It also saves the data as a minified file in the src/data folder, so that it can be imported into the library.
 */

// Use async/await
// Use fetch to get the data from the API
// Use the reduce method to group the data by country_code
// Use the reduce method again to find the latest year for each country
// Use a for loop to get the emissions intensity data
// Save the data to the gridIntensityResults object
// Save the full data set to a JSON file
// Save the country code and emissions data only to a JS file
// Save a minified version of the JS file to the src/data folder

(async () => {
  const response = await fetch(sourceURL);
  const data = await response.json();

  // Group data by country_code
  const groupedData = await data.reduce((acc, item) => {
    const key =
      item.country_code === "" ? item.country_or_region : item.country_code;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Loop through the grouped data and find the latest year
  const latestData = await Object.keys(groupedData).reduce((acc, key) => {
    // Find the last year in the array with emissions intensity data
    const latestYear = groupedData[key].reduce((acc, item, index) => {
      if (
        item.emissions_intensity_gco2_per_kwh === null ||
        item.emissions_intensity_gco2_per_kwh === ""
      ) {
        return acc;
      }
      return index;
    }, 0);

    acc[key] = groupedData[key][latestYear];
    return acc;
  }, {});

  // Loop through the data and extract the emissions intensity data
  // Save it to the gridIntensityResults object with the country code as the key
  Object.values(latestData).forEach((row) => {
    if (
      row.emissions_intensity_gco2_per_kwh === null ||
      row.emissions_intensity_gco2_per_kwh === ""
    ) {
      return;
    }

    const country =
      row.country_code === "" ? row.country_or_region : row.country_code;

    gridIntensityResults[country.toUpperCase()] =
      row.emissions_intensity_gco2_per_kwh;

    generalResults[country] = {
      country_code: row.country_code,
      country_or_region: row.country_or_region,
      year: row.year,
      emissions_intensity_gco2_per_kwh: row.emissions_intensity_gco2_per_kwh,
    };
  });

  // This saves the country code and emissions data only, for use in the CO2.js library
  fs.writeFileSync(
    "data/output/average-intensities.js",
    `const data = ${JSON.stringify(gridIntensityResults, null, "  ")}; 
const type = "${type}";
export { data, type }; 
export default { data, type };
`
  );
  // Save a minified version to the src folder so that it can be easily imported into the library
  fs.writeFileSync(
    "src/data/average-intensities.min.js",
    `const data = ${JSON.stringify(gridIntensityResults)}; const type = "${type}"; export { data, type }; export default { data, type };`
  );

  // This saves the full data set as a JSON file for reference.
  fs.writeFileSync(
    "data/output/average-intensities.json",
    JSON.stringify(generalResults, null, "  ")
  );
})();