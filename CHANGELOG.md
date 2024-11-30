# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> - **Added** for new features.
> - **Changed** for changes in existing functionality.
> - **Deprecated** for soon-to-be removed features.
> - **Removed** for now removed features.
> - **Fixed** for any bug fixes.
> - **Security** in case of vulnerabilities.

## Unreleased

- Add ability to create adaptors which provide access to external data sources #134
- Add access to the Electricity Maps API free tier #134
- Allow access to individual models and their internal functions #195
<!-- - _(Add a summary of your feature, and if relevant the issue, in your PR for merging into `main`)_ -->

## Released

### [0.16.3] - 2024-11-30

#### Fixed

- Include all gridIntensity values when running the perVisitTrace or perByteTrace functions. #237

### [0.16.2] - 2024-11-12

#### _Added_

- Add JSDoc comments to data generation scripts and outputs #230
- Added basic error handling to data fetch in emissions script #221

#### Fixed

- Bump url2green version #238

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.16.1] - 2024-09-10

#### Changed

- _[Experimental]_ Add minimum capability to publish CO2.js to JSR.
- Automated monthly update of annual average grid intensity data.

### [0.16.0] - 2024-07-01

#### _Added_

- Add the Sustainable Web Design Rating system #205
- Add the updated Sustainable Web Design Model version 4 #119

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.15.0] - 2024-05-03

#### Changed

- Add access to more verbose data response from Greencheck API

#### Removed

- Removed Page X-ray specific functions:
  - `perDomain`
  - `perPage`
  - `perContentType`
  - `dirtiestResources`
  - `perParty`

### [0.14.4] - 2024-03-08

#### Changed

- Automated monthly update of annual average grid intensity data.

#### Deprecated

- Removing Page X-ray specific functions:
  - `perDomain`
  - `perPage`
  - `perContentType`
  - `dirtiestResources`
  - `perParty`

### [0.14.3] - 2024-02-21

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.14.2] - 2024-01-29

- Adds user agent header for requests to Green Web Foundation APIs

### [0.14.1] - 2024-01-09

#### Changed

- Removed `index.d.ts` in favour of importing type definitions from `@types/tgwf__co2`.
- Reduce package size by excluding files from publish NPM package.
- Automated monthly update of annual average grid intensity data.

### [0.13.10] - 2023-12-16

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.13.9] - 2023-11-07

#### Fixed

- Fix to return expected results when variables with 0 value are passed into function

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.13.8] - 2023-10-09

#### Fixed

- Properly use value of 0 for system segments and variables in the perByteTrace and perVisitTrace functions.

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.13.7] - 2023-09-13

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.13.6] - 2023-08-08

#### Changed

- Automated monthly update of annual average grid intensity data.
- Create FUNDING.yml to allow sponsor contribution to this project.
- Store segment flag on CO2 instance, not models.

### [0.13.5] - 2023-07-5

#### Changed

- Automated monthly update of annual average grid intensity data.

### [0.13.4] - 2023-05-24

#### Fixed

- Fixed an error when try to use global grid intensities in IIFE. (PR #147)

### [0.13.3] - 2023-05-18

#### Changed

- Updated the global grid intensity constant to use the latest WORLD grid intensity value from Ember. (PR #142)

### [0.13.2] - 2023-04-21

- Fix to ensure that region names that are keys in the average annual grid intensity export are capitalised.

### [0.13.1] - 2023-04-20

#### Fixed

- Fixed the import of average grid intensities in node. (PR #137)

### [0.13.0] - 2023-04-13

#### Changed

In PR #135 there were significant changes made to how average annual grid intensities are fetched and generated.

- Updated average annual grid intensities to include 2022 values from Ember.
- Changed the functions to generate average grid intensities to:
  - Fetch data directly from Ember's API.
  - Get the _latest_ annual average values for each country/region.
- Renamed the average grid intensities export file.

### [0.12.2] - 2023-03-01

#### Added

- Add a module declaration for use from typescript (PR #131)

#### Changed

- Updated 2021 average annual grid intensity values (PR #133)

### [0.12.1] - 2023-02-02

#### Fixed

- Removed incorrectly imported constants in tests.

### [0.12.0] - 2023-02-02

#### Added

- Introduced two new functions `perByteTrace` and `perVisitTrace` which allow developers to pass an options object containing customised values for the constants used in the Sustainable Web Design model. (PR #126)

#### Changed

- Allowed developers now have the option to return a breakdown of carbon emissions estimates by system segment when using the Sustainable Web Design model. (PR #113)

### [0.11.4] - 2022-12-02

#### Fixed

- Updated the `greenCheckMulti` function to work properly in ESM. (PR #123)

### [0.11.3] - 2022-10-13

#### Fixed

- Corrected the Node export for the hosting raised in issue #110. (PR #118)

### [0.11.2] - 2022-10-11

#### Fixed

- v0.11.x updates increased library size to 17MB + when published to NPM. This has been raised in [#108](https://github.com/thegreenwebfoundation/co2.js/issues/108) and it was found data files were being included in the published package. (PR #117)

### [0.11.1] - 2022-10-07

#### Changed

- We have used generic filenames for data files, to avoid any confusion around the data being provided in this library. (PR #112)

### [0.11.0] - 2022-10-03

#### Added

- Introduced average and marginal carbon intensity data into the library. This comes from [Ember Climate](https://ember-climate.org/data/data-explorer/) (for average carbon intensity data), and [The Green Web Foundation](https://developers.thegreenwebfoundation.org/co2js/data) (marginal intensity data, originally sourced from the UNFCCC - the United Nations Framework Convention on Climate Change). For more, [see our release guide for v0.11](https://www.thegreenwebfoundation.org/news/release-guide-co2-js-v0-11/) about the differences between the kinds of data. See [#64](https://github.com/thegreenwebfoundation/co2.js/issues/64), and [#97](https://github.com/thegreenwebfoundation/co2.js/issues/97) for more.
- Added new paths to `import` and `require` the annual, country-level average and marginal carbon intensity data mentioned above like, as javascript objects, or as JSON. See [#104 for more](https://github.com/thegreenwebfoundation/co2.js/issues/104).
- Added links to CO2.js in forms already available on CDNs to avoid needing to npm install it to try it out. See [#105 for more](https://github.com/thegreenwebfoundation/co2.js/issues/105).
- Introduced scripts to automate the generation of grid intensity data based of Ember & UNFCCC source files.
- Introduced a `release:minor` command, to automate the publishing process, to complement `release:patch`.

#### Changed

- Changed the default model for transfer based CO2 calculations from the _1byte_ model to the _Sustainable Web Design_ model instead. See <https://developers.thegreenwebfoundation.org/co2js/models/> for guidance on the differences and how to migrate between them. See [#94 for more](https://github.com/thegreenwebfoundation/co2.js/issues/94).
- Updated our release commands to generate and format the carbon intensity data as part of the release process.

### [0.10.4] - 2022-08-12

#### Added

- Introduced a `release:patch` command, to automate the publishing process. This is designed to make sure we always publish the most recent compiled code, by adding a rebuild step that can be easy to forget.

### [0.10.3] - 2022-08-12

#### Added

- Introduced a new `perVisit()` function for the Sustainable Web Design model, which applies [caching and return visits assumptions](https://sustainablewebdesign.org/calculating-digital-emissions/).

### [0.10.2] - 2022-08-12

- Added the ability to set the model used by CO2.js to the Sustainable Web Design model, using a simple 'swd' string, instead of needing to pass in a class.

### [0.10.1] - 2022-08-01

This release used a version bump as previously we had released v0.10.0 under a pre-release tag.

### [0.10.0] - 2022-06-27

- Added ES import syntax as the main way for handling imports and exports of code within the module.
- Changed eslint settings to use later version of ecmascript (2020)
- Change the build tools to use esbulid with jest instead of babel
- Added more consistent use of the debug logging library in files using the updated import syntax
- Fixed the incorrect order of FIRST_TIME_VIEWING_PERCENTAGE and RETURNING_VISITOR_PERCENTAGE constants in the SWD model. This will result in **larger** values for calculations using the sustainable web design, and the default caching assumptions.

### [0.9.0] - 2022-03-28

#### Added

- Added newly implemented Sustainable Web Design model [thanks @dryden!]
- Added new readme page for using both emissions models
- Added new source of data to the Sustainable Web Design model from Ember Climate.

#### Changed

- Changed the CO2 class to accept either the One Byte model or the Sustainable Web Design model

#### Fixed

- Fixed various typos.

### [0.8.0] - 2021-11-28

####  Fixed

- Update further dependencies
- Fix embarassing order of magnitude typo in 1byte model (thanks @mstaschik!)

#### Added

- Read JSON blob also as gzipped #44 (thanks @soulgalore)

#### Changed

- The 1byte model will give different numbers now. It's mentioned in `#fixed` but it's worth repeating.

### [0.7.0] - 2021-11-28

#### Fixed

- Update tests to avoid network requests #50
- Update dependencies across the board

####  Changed

- Switch to github actions instead of travis for CI.

### [0.6.1] - 2020-03-15

#### Fixed

- Added the function to load JSON, on the tgwg.hosting object, for use in the sustaiable web sitespeed plugin.

### [0.6.0] - 2020-03-15

#### Added

- Added the hosting-JSON for running local checks against an array instead of SQLite.

#### Changed

- Swapped out checking against a sqlite database `hosting-json`in favour of simple array in,
- Updated conventions for style - using kebab-cases over CamelCase for naming files

#### Removed

- Extracted sqlite usage and dependencies into a separate module, `url2green`. This means you no longer need to compile SQLite on install.

### [0.5.0] - 2020-03-03

#### Changed

- Updated README
- Updated the emissions figured for green energy after further research on methodology with @@JamieBeevor
- Incorporated class based CO2 models from @soulgalore
- Credit contributors

### [0.4.7] - 2020-03-02

#### Added

- Added a changelog at last!

### [0.4.6] - 2020-03-01

#### Added

- Changelog inconsistency section in Bad Practices

### [0.4.4] - 2020-03-01

#### Added

Added the (currently unused) green byte model.

#### Changed

Update the 1byte model to use an average of devices, rather than just wifi

### [0.4.3] - 2020-03-01

#### Added

#### Changed

Split hosting API into two separate files (one for sqlite, and one relying on the greencheck API)
