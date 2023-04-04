const fs = require("fs");
const type = "average";

// This URL from Ember returns ALL the data for the country_overview_yearly table
const sourceURL =
  "https://ember-data-api-scg3n.ondigitalocean.app/ember/country_overview_yearly.json?_sort=rowid&_shape=array";
const gridIntensityResults = {};
const generalResults = {};

// Fetch data from the source URL in a function
(async () => {
  const response = await fetch(sourceURL);
  const data = await response.json();

  // Group data by country_code
  const groupedData = data.reduce((acc, item) => {
    const key = item.country_code;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Loop through the grouped data and find the latest year
  const latestData = Object.keys(groupedData).reduce((acc, key) => {
    const latestYear = groupedData[key].length - 1;
    acc[key] = groupedData[key][latestYear];
    return acc;
  }, {});

  // Loop through the data and extract the emissions intensity data
  // Save it to the gridIntensityResults object with the country code as the key
  for (let row of data) {
    if (
      row.emissions_intensity_gco2_per_kwh === null ||
      row.emissions_intensity_gco2_per_kwh === ""
    )
      continue;
    const country =
      row.country_code === "" ? row.country_or_region : row.country_code;
    gridIntensityResults[country] = row.emissions_intensity_gco2_per_kwh;

    generalResults[country] = {
      country_code: row.country_code,
      country_or_region: row.country_or_region,
      year: row.year,
      emissions_intensity_gco2_per_kwh: row.emissions_intensity_gco2_per_kwh,
    };
  }

  const gridIntensityJson = JSON.stringify(gridIntensityResults);

  // This saves the country code and emissions data only, for use in the CO2.js library
  fs.writeFileSync(
    "data/output/average-intensities.js",
    `const data = ${gridIntensityJson}; 
const type = "${type}";
export { data, type }; 
export default { data, type };`
  );
  // Save a minified version to the src folder so that it can be easily imported into the library
  fs.writeFileSync(
    "src/data/average-intensities.min.js",
    `const data = ${gridIntensityJson}; const type = "${type}"; export { data, type }; export default { data, type };`
  );

  // This saves the full data set as a JSON file for reference.
  fs.writeFileSync(
    "data/output/average-intensities.json",
    JSON.stringify(generalResults)
  );
})();
