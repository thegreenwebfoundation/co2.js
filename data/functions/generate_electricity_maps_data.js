import { mkdir, writeFile, access, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { zones } from "../fixtures/electricity-maps-zones.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const years = ["2025"];
const emapsAPIKey = process.env.EMAPS_API_KEY;

async function downloadDataFiles() {
  const dataDir = join("data", "output", "electricity-maps");
  await mkdir(dataDir, { recursive: true });
  await mkdir(join("src", "data", "electricity-maps"), { recursive: true });

  // Download data for each zone for each year
  for (const year of years) {
    const yearlyData = {};

    for (const zone of Object.keys(zones)) {
      const apiUrlCarbonIntensity = `https://api.electricitymaps.com/v3/carbon-intensity/past?temporalGranularity=yearly&zone=${zone}&datetime=${year}-12-31T12:00Z`;
      const apiUrlRenewable = `https://api.electricitymaps.com/v3/renewable-energy/past?temporalGranularity=yearly&zone=${zone}&datetime=${year}-12-31T12:00Z`;
      const apiUrlCarbonFree = `https://api.electricitymaps.com/v3/carbon-free-energy/past?temporalGranularity=yearly&zone=${zone}&datetime=${year}-12-31T12:00Z`;

      try {
        await access(filePath);
        console.debug(`File already exists: ${filePath}`);
      } catch {
        console.log(`Fetching data for ${zone} in ${year}`);
        const zoneData = {
          carbonIntensity: {
            value: undefined,
            unit: "gCO2eq/kWh",
          },
          renewableEnergy: {
            value: undefined,
            unit: "%",
          },
          carbonFreeEnergy: {
            value: undefined,
            unit: "%",
          },
        };

        const responseCarbonIntensity = await fetch(apiUrlCarbonIntensity, {
          headers: {
            "auth-token": `${emapsAPIKey}`,
          },
        });

        const responseRenewable = await fetch(apiUrlRenewable, {
          headers: {
            "auth-token": `${emapsAPIKey}`,
          },
        });

        const responseCarbonFree = await fetch(apiUrlCarbonFree, {
          headers: {
            "auth-token": `${emapsAPIKey}`,
          },
        });

        if (responseCarbonIntensity) {
          const zoneDataCarbonIntensity = await responseCarbonIntensity.json();
          zoneData.carbonIntensity.value =
            zoneDataCarbonIntensity.carbonIntensity;
        } else {
          console.error(
            `No carbon intensity data found for ${zone} in ${year}`
          );
        }

        if (responseRenewable) {
          const zoneDataRenewable = await responseRenewable.json();
          zoneData.renewableEnergy.value = zoneDataRenewable.value;
        } else {
          console.error(`No renewable data found for ${zone} in ${year}`);
        }

        if (responseCarbonFree) {
          const zoneDataCarbonFree = await responseCarbonFree.json();
          zoneData.carbonFreeEnergy.value = zoneDataCarbonFree.value;
        } else {
          console.error(
            `No carbon free energy data found for ${zone} in ${year}`
          );
        }

        yearlyData[zone] = zoneData;
      }
    }

    const jsYearlyData = `export const data = ${JSON.stringify(yearlyData)}
    export const methodology = "https://www.electricitymaps.com/data/methodology"
    export default { data, methodology };
    `;
    await writeFile(join(dataDir, `yearly_${year}.js`), jsYearlyData);
    await writeFile(
      join(dataDir, `yearly_${year}.json`),
      JSON.stringify(yearlyData)
    );

    await writeFile(
      join("src", "data", "electricity-maps", `yearly_${year}.js`),
      jsYearlyData
    );
    console.log(`Files saved successfully`);
  }
}

async function generateElectricityMapsData() {
  await downloadDataFiles();
}

generateElectricityMapsData();
