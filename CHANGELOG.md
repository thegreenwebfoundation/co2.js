# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
-

## Unreleased

- Include a new alternative, "Green Byte Model" with the figures after speaking to folks at the IEA and other places.

# [0.8.0] - 2021-11-28

### Fixed

- Update further dependencies
- Fix embarassing order of magnitude typo in 1byte model (thanks @mstaschik!)

## Added

- Read JSON blob also as gzipped #44 (thanks @soulgalore)

### Changed

- The 1bye model will give different numbers now. It's mentioned in `#fixed` but it's worth repeating.

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

- Update README
- Update the emissions figured for green energy after further research on methodology with @@JamieBeevor
- Incorproate class based CO2 models from @soulgalore
- Credit contributors


## [0.4.7] - 2020-03-02

### Added

- Added a changelog at last!

## [0.4.6] - 2020-03-01

### Added

- Changelog inconsistency section in Bad Practices

## [0.4.4] - 2020-03-01

### Added

Add the (currently unused) green byte model.

### Changed

Update the 1byte model to use an average of devices, rather than just wifi

## [0.4.3] - 2020-03-01

### Added

### Changed

Split hosting API into two separate files (one for sqlite, and one relying on the greencheck API)

