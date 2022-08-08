# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Added** for new features.
> **Changed** for changes in existing functionality.
> **Deprecated** for soon-to-be removed features.
> **Removed** for now removed features.
> **Fixed** for any bug fixes.
> **Security** in case of vulnerabilities.

## Unreleased

### Added

- Added the ability to set the model used by CO2.js to the Sustainable Web Design model, using a simple 'swd' string, instead of needing to pass in a class.

## 0.10.1 2022-08-01

This release used a version bump as previously we had released v0.10.0 under a pre-release tag.

## 0.10.0 2022-06-27

- Added ES import syntax as the main way for handling imports and exports of code within the module.
- Changed eslint settings to use later version of ecmascript (2020)
- Change the build tools to use esbulid with jest instead of babel
- Added more consistent use of the debug logging library in files using the updated import syntax
- Fixed the incorrect order of FIRST_TIME_VIEWING_PERCENTAGE and RETURNING_VISITOR_PERCENTAGE constants in the SWD model. This will result in **larger** values for calculations using the sustainable web design, and the default caching assumptions.


# [0.9.0] - 2022-03-28

### Added

- Added newly implemented Sustainable Web Design model [thanks @dryden!]
- Added new readme page for using both emissions models
- Added new source of data to the Sustainable Web Design model from Ember Climate.
### Changed

- Changed the CO2 class to accept either the One Byte model or the Sustainable Web Design model
### Fixed

- Fixed various typos.

# [0.8.0] - 2021-11-28

### Fixed

- Update further dependencies
- Fix embarassing order of magnitude typo in 1byte model (thanks @mstaschik!)

## Added

- Read JSON blob also as gzipped #44 (thanks @soulgalore)

### Changed

- The 1byte model will give different numbers now. It's mentioned in `#fixed` but it's worth repeating.

## [0.7.0] - 2021-11-28

### Fixed

- Update tests to avoid network requests #50
- Update dependencies across the board

### Changed

- Switch to github actions instead of travis for CI.

## [0.6.1] - 2020-03-15

### Fixed

- Added the function to load JSON, on the tgwg.hosting object, for use in the sustaiable web sitespeed plugin.

## [0.6.0] - 2020-03-15

### Added

- Added the hosting-JSON for running local checks against an array instead of SQLite.

### Changed

- Swapped out checking against a sqlite database `hosting-json`in favour of simple array in,
- Updated conventions for style - using kebab-cases over CamelCase for naming files

### Removed

- Extracted sqlite usage and dependencies into a separate module, `url2green`. This means  you no longer need to compile SQLite on install.

## [0.5.0] - 2020-03-03

### Changed

- Updated README
- Updated the emissions figured for green energy after further research on methodology with @@JamieBeevor
- Incorporated class based CO2 models from @soulgalore
- Credit contributors


## [0.4.7] - 2020-03-02

### Added

- Added a changelog at last!

## [0.4.6] - 2020-03-01

### Added

- Changelog inconsistency section in Bad Practices

## [0.4.4] - 2020-03-01

### Added

Added the (currently unused) green byte model.

### Changed

Update the 1byte model to use an average of devices, rather than just wifi

## [0.4.3] - 2020-03-01

### Added

### Changed

Split hosting API into two separate files (one for sqlite, and one relying on the greencheck API)

