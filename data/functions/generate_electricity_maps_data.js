import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { zones } from "../fixtures/electricity-maps-zones.js";

const years = ["2021"];
const emapsAPIKey = process.env.EMAPS_API_KEY;

async function downloadDataFiles() {
  const dataDir = join("data", "output", "electricity-maps");
  await mkdir(dataDir, { recursive: true });
  await mkdir(join("src", "data", "electricity-maps"), { recursive: true });

  // Download data for each zone for each year
  for (const year of years) {
    const yearlyData = {};

    const jsDataPath = join(dataDir, `yearly_${year}.js`);
    const yearlyDataPath = join(dataDir, `yearly_${year}.json`);
    const jsDataSrcPath = join(
      "src",
      "data",
      "electricity-maps",
      `yearly_${year}.js`
    );

    const filesAlreadyExist =
      (await existsSync(jsDataPath)) &&
      (await existsSync(yearlyDataPath)) &&
      (await existsSync(jsDataSrcPath));

    for (const zone of Object.keys(zones)) {
      const apiUrlCarbonIntensity = `https://api.electricitymaps.com/v3/carbon-intensity/past?temporalGranularity=yearly&zone=${zone}&datetime=${year}-12-31T12:00Z`;
      const apiUrlRenewable = `https://api.electricitymaps.com/v3/renewable-energy/past?temporalGranularity=yearly&zone=${zone}&datetime=${year}-12-31T12:00Z`;
      const apiUrlCarbonFree = `https://api.electricitymaps.com/v3/carbon-free-energy/past?temporalGranularity=yearly&zone=${zone}&datetime=${year}-12-31T12:00Z`;

      if (filesAlreadyExist) {
        console.log(
          `Files already exist: ${jsDataPath}, ${yearlyDataPath}, ${jsDataSrcPath}`
        );
      } else {
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

    if (!filesAlreadyExist) {
      const jsYearlyData = `export const data = ${JSON.stringify(yearlyData)}
    export const methodology = "https://www.electricitymaps.com/data/methodology"
    export default { data, methodology };
    `;
      await writeFile(jsDataPath, jsYearlyData);
      await writeFile(yearlyDataPath, JSON.stringify(yearlyData));

      await writeFile(jsDataSrcPath, jsYearlyData);
      console.log(`Files saved successfully`);
    }
  }
}

async function generateElectricityMapsData() {
  await downloadDataFiles();
}

generateElectricityMapsData();
