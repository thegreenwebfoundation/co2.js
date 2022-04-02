import csv
import json

intensity_by_country = {}
rows_2020 = None
rows_2021 = None

# build our first data structure
with open("data/co2-intensities-ember-2020.csv") as ember2020:

    rows_2020 = csv.DictReader(ember2020)
    for row in rows_2020:
        if row["country_code"]:
            intensity_by_country[row["country_code"]] = row


# now add the latest year
with open("data/co2-intensities-ember-2021.csv") as ember2021:
    rows_2021 = csv.DictReader(ember2021)
    for row in rows_2021:
        if row["country_code"]:
            intensity_by_country[row["country_code"]] = row

# TODO add the figure for world, and the EU, africa and other groupings

with open("data/intensity-by-country.json", "w+") as outfile:
    outfile.write(json.dumps(intensity_by_country))

