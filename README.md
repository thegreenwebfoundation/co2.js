# CO2.js

<img src="https://github.com/thegreenwebfoundation/co2.js/actions/workflows/unittests.yml/badge.svg" />

One day, the internet will be powered by renewable energy. Until that day comes, there’ll be a CO2 cost that comes with every byte of data that’s uploaded or downloaded. By being able to calculate these emissions, developers can be empowered to create more efficient, lower carbon apps, websites, and software.

## [Documentation](https://developers.thegreenwebfoundation.org/co2js/overview/)
## [Changelog](/CHANGELOG.md)

## What is CO2.js?

CO2.js is a JavaScript library that enables developers a way to estimate the emissions related to use of their apps, websites, and software.

## Why use it?

Being able to estimate the CO2 emissions associated with digital activities can be of benefit to both developers and users.

Internally, you may want to use this library to create a *carbon budget* for your site or app. It is also useful for inclusion in dashboards and monitoring tools.

For user facing applications, CO2.js could be used to check & block the uploading of carbon intensive files. Or, to present users with information about the carbon impact of their online activities (such as browsing a website).

The above a just a few examples of the many and varied ways CO2.js can be applied to provide carbon estimates for data transfer. If you’re using CO2.js in production we’d love to hear how! [Contact us](https://www.thegreenwebfoundation.org/support-form/) via our website.

## Installation

### Using NPM

You can install CO2.js as a dependency for your projects using NPM.

```bash
npm install @tgwf/co2
```

### Using Skypack

You can import the CO2.js library into projects using Skypack.

```js
import tgwf from 'https://cdn.skypack.dev/@tgwf/co2';
```


### Build it yourself

You can also build the CO2.js library from the source code. To do this:

1. Go to the [CO2.js repository](https://github.com/thegreenwebfoundation/co2.js) on GitHub.
1. Clone or fork the repository.
1. Navigate to the folder on your machine and run `npm run build` in your terminal.
1. Once the build has finished running, you will find a `/dist` folder has been created. Inside you can find:
  
    - `dist/cjs` - A CommonJS compatible build.
    - `dist/esm` - An ES Modules compatible build.
    - `dist/iife` - An Immediately Invoked Function Expression (IIFE) version of the library.

## Publishing to NPM

We use [`np`](https://www.npmjs.com/package/np) to publish new versions of this library to NPM. To do this:

1. First login to NPM by running the `npm login` command in your terminal.
2. Then run `npx np <VERSION>`.
3. `np` will run several automated steps to publish the new package to NPM.
4. If everything runs successfully, you can then add release notes to GitHub for the newly published package.

## Marginal and average emissions intensity data

CO2.js includes yearly average grid intensity data from [Ember](https://ember-climate.org/data/data-explorer/), as well as marginal intensity data from the [UNFCCC](https://unfccc.int/) (United Nations Framework Convention on Climate Change). You can find the data in JSON and CommonJS Module format in the `data/output` folder.

## Licenses

The code for CO2.js is licensed Apache 2.0.

The carbon intensity data from Ember is published under the Creative Commons ShareAlike Attribution Licence ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/))
