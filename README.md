# CO2.js

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-21-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<img src="https://github.com/thegreenwebfoundation/co2.js/actions/workflows/unittests.yml/badge.svg" />

One day, the internet will be powered by renewable energy. Until that day comes, there’ll be a CO2 cost that comes with every byte of data that’s uploaded or downloaded. By being able to calculate these emissions, developers can be empowered to create more efficient, lower carbon apps, websites, and software.

## [Documentation](https://developers.thegreenwebfoundation.org/co2js/overview/) | [Changelog](/CHANGELOG.md) | [Roadmap](https://github.com/orgs/thegreenwebfoundation/projects/3/views/1)

## What is CO2.js?

CO2.js is a JavaScript library that enables developers a way to estimate the emissions related to use of their apps, websites, and software.

## Why use it?

Being able to estimate the CO2 emissions associated with digital activities can be of benefit to both developers and users.

Internally, you may want to use this library to create a _carbon budget_ for your site or app. It is also useful for inclusion in dashboards and monitoring tools.

For user facing applications, CO2.js could be used to check & block the uploading of carbon intensive files. Or, to present users with information about the carbon impact of their online activities (such as browsing a website).

The above are just a few examples of the many and varied ways CO2.js can be applied to provide carbon estimates for data transfer. If you’re using CO2.js in production we’d love to hear how! [Contact us](https://www.thegreenwebfoundation.org/support-form/) via our website.

## Installation

### Using NPM

You can install CO2.js as a dependency for your projects using NPM.

```bash
npm install @tgwf/co2
```

### Using esm.sh

You can import the CO2.js library into projects using esm.sh.

```js
import tgwf from "https://esm.sh/@tgwf/co2@latest";
```

## Using a JS CDN

You can get the latest version of CO2.js using one of the content delivery networks below.

### jsDelivr

You can find the package at [https://www.jsdelivr.com/package/npm/@tgwf/co2](https://www.jsdelivr.com/package/npm/@tgwf/co2).

- CommonJS compatible build `https://cdn.jsdelivr.net/npm/@tgwf/co2@latest/dist/cjs/index-node.min.js`
- ES Modules compatible build `https://cdn.jsdelivr.net/npm/@tgwf/co2@latest/dist/esm/index.js`
- IIFE compatible build `https://cdn.jsdelivr.net/npm/@tgwf/co2@latest/dist/iife/index.js`

### Unpkgd

You can find the package at [https://unpkg.com/browse/@tgwf/co2@latest/](https://unpkg.com/browse/@tgwf/co2@latest/).

- CommonJS compatible build `https://unpkg.com/@tgwf/co2@latest/dist/cjs/index-node.min.js`
- ES Modules compatible build `https://unpkg.com/@tgwf/co2@latest/dist/esm/index.js`
- IIFE compatible build `https://unpkg.com/@tgwf/co2@latest/dist/iife/index.js`

### Build it yourself

You can also build the CO2.js library from the source code. To do this:

1. Go to the [CO2.js repository](https://github.com/thegreenwebfoundation/co2.js) on GitHub.
1. Clone or fork the repository.
1. Navigate to the folder on your machine and run `npm run build` in your terminal.
1. Once the build has finished running, you will find a `/dist` folder has been created. Inside you can find:

   - `dist/cjs` - A CommonJS compatible build.
   - `dist/esm` - An ES Modules compatible build.
   - `dist/iife` - An Immediately Invoked Function Expression (IIFE) version of the library.

## TypeScript support

Type definitions for CO2.js are [published in the DefinitelyTyped project](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/tgwf__co2), and are [available on NPM](https://www.npmjs.com/package/@types/tgwf__co2) at `@types/tgwf__co2`.

If you want to use type definitions in your project, they should be installed as a devDependency.

`npm install --dev @types/tgwf__co2`

## Marginal and average emissions intensity data

CO2.js includes yearly average grid intensity data from [Ember](https://ember-climate.org/data/data-explorer/), as well as marginal intensity data from the [UNFCCC](https://unfccc.int/) (United Nations Framework Convention on Climate Change). You can find the data in JSON and CommonJS Module format in the `data/output` folder.

### Using emissions intensity data

You can import annual, country-level marginal or average grid intensity data into your projects directly from CO2.js. For example, if we wanted to use the average grid intensity for Australia in our project, we could use the code below:

```js
import { averageIntensity } from "@tgwf/co2";
const { data } = averageIntensity;
const { AUS } = data;
console.log({ AUS });
```

All countries are represented by their respective [Alpha-3 ISO country code](https://www.iso.org/obp/ui/#search).

## Publishing to NPM

We use [`np`](https://www.npmjs.com/package/np) to publish new versions of this library to NPM. To do this:

1. First login to NPM by running the `npm login` command in your terminal.
2. Then run `npx np <VERSION>`.
3. `np` will run several automated steps to publish the new package to NPM.
4. If everything runs successfully, you can then add release notes to GitHub for the newly published package.

## Release communication

CO2.js releases will be communicated through the following channels:

| Channel                                                                                         | Minor Release (0.xx) | Patch Release (0.xx.x) |
| ----------------------------------------------------------------------------------------------- | -------------------- | ---------------------- |
| [Github](https://github.com/thegreenwebfoundation/co2.js/releases)                              | ✅                   | ✅                     |
| [Green Web Foundation website](https://www.thegreenwebfoundation.org/co2-js/#releases)          | ✅                   | ❌                     |
| W3C Slack Sustainability Channel                                                                | ✅                   | ❌                     |
| ClimateAction.Tech Slack                                                                        | ✅                   | ❌                     |
| [Green Web Foundation LinkedIn Account](https://www.linkedin.com/company/green-web-foundation/) | ✅                   | ❌                     |

## Licenses

The code for CO2.js is licensed Apache 2.0. ([What does this mean?](<https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)>))

The average carbon intensity data from Ember is published under the Creative Commons ShareAlike Attribution Licence ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)). ([What does this mean?](https://www.tldrlegal.com/license/creative-commons-attribution-share-alike-cc-sa))

The marginal intensity data is published by the Green Web Foundation, under the Creative Commons ShareAlike Attribution Licence ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)). ([What does this mean?](https://www.tldrlegal.com/license/creative-commons-attribution-share-alike-cc-sa))

See LICENCE for more.

## Contributors

To contribute changes back to this project, please follow the steps outlined in the [CONTRIBUTING.md](/CONTRIBUTING.md) file in this repository.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mrchrisadams"><img src="https://avatars.githubusercontent.com/u/17906?v=4?s=100" width="100px;" alt="Chris Adams"/><br /><sub><b>Chris Adams</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=mrchrisadams" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.fershad.com/"><img src="https://avatars.githubusercontent.com/u/27988517?v=4?s=100" width="100px;" alt="fershad"/><br /><sub><b>fershad</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=fershad" title="Code">💻</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=fershad" title="Documentation">📖</a> <a href="#maintenance-fershad" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.peterhedenskog.com/"><img src="https://avatars.githubusercontent.com/u/540757?v=4?s=100" width="100px;" alt="Peter Hedenskog"/><br /><sub><b>Peter Hedenskog</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=soulgalore" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.drydenwilliams.co.uk/"><img src="https://avatars.githubusercontent.com/u/4403089?v=4?s=100" width="100px;" alt="Dryden"/><br /><sub><b>Dryden</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=drydenwilliams" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://evanhahn.com/"><img src="https://avatars.githubusercontent.com/u/777712?v=4?s=100" width="100px;" alt="Evan Hahn"/><br /><sub><b>Evan Hahn</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=EvanHahn" title="Code">💻</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=EvanHahn" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PrathumP"><img src="https://avatars.githubusercontent.com/u/115390367?v=4?s=100" width="100px;" alt="Prathum Pandey"/><br /><sub><b>Prathum Pandey</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/issues?q=author%3APrathumP" title="Bug reports">🐛</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=PrathumP" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Fdawgs"><img src="https://avatars.githubusercontent.com/u/43814140?v=4?s=100" width="100px;" alt="Frazer Smith"/><br /><sub><b>Frazer Smith</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=Fdawgs" title="Code">💻</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=Fdawgs" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hamishfagg"><img src="https://avatars.githubusercontent.com/u/895845?v=4?s=100" width="100px;" alt="Hamish Fagg"/><br /><sub><b>Hamish Fagg</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=hamishfagg" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://portfolio.toolness.org/"><img src="https://avatars.githubusercontent.com/u/124687?v=4?s=100" width="100px;" alt="Atul Varma"/><br /><sub><b>Atul Varma</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=toolness" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.intersectionalenvironmentalist.com/"><img src="https://avatars.githubusercontent.com/u/1530684?v=4?s=100" width="100px;" alt="Piper"/><br /><sub><b>Piper</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=piperchester" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://vasquezruiz.com/"><img src="https://avatars.githubusercontent.com/u/108420?v=4?s=100" width="100px;" alt="Raymundo Vásquez Ruiz"/><br /><sub><b>Raymundo Vásquez Ruiz</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=raymundovr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://greengumption.co.uk/"><img src="https://avatars.githubusercontent.com/u/26165947?v=4?s=100" width="100px;" alt="JamieB"/><br /><sub><b>JamieB</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=JamieBeevor" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/p-gerard"><img src="https://avatars.githubusercontent.com/u/97036756?v=4?s=100" width="100px;" alt="p-gerard"/><br /><sub><b>p-gerard</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/issues?q=author%3Ap-gerard" title="Bug reports">🐛</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=p-gerard" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sfishel18"><img src="https://avatars.githubusercontent.com/u/294695?v=4?s=100" width="100px;" alt="Simon Fishel"/><br /><sub><b>Simon Fishel</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=sfishel18" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dsubject"><img src="https://avatars.githubusercontent.com/u/33845418?s=64&v=4?s=100" width="100px;" alt="Dani Subject"/><br /><sub><b>Dani Subject</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=dsubject" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Malay-dev"><img src="https://avatars.githubusercontent.com/u/91375797?s=64&v=4?s=100" width="100px;" alt="Malay Kumar"/><br /><sub><b>Malay Kumar</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=Malay-dev" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/samuelIkoli"><img src="https://avatars.githubusercontent.com/u/98848723?v=4?s=100" width="100px;" alt="Samuel Ikoli"/><br /><sub><b>Samuel Ikoli</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=samuelIkoli" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/APJohns"><img src="https://avatars.githubusercontent.com/u/18357173?v=4?s=100" width="100px;" alt="Ash Johns"/><br /><sub><b>Ash Johns</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/issues?q=author%3AAPJohns" title="Bug reports">🐛</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=APJohns" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mgriffin-scottlogic"><img src="https://avatars.githubusercontent.com/u/117279304?v=4?s=100" width="100px;" alt="Matthew Griffin"/><br /><sub><b>Matthew Griffin</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=mgriffin-scottlogic" title="Documentation">📖</a> <a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=mgriffin-scottlogic" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hanopcan"><img src="https://avatars.githubusercontent.com/u/11687898?v=4?s=100" width="100px;" alt="Hannah"/><br /><sub><b>Hannah</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=hanopcan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alexzurbonsen"><img src="https://avatars.githubusercontent.com/u/82914459?v=4?s=100" width="100px;" alt="Alex"/><br /><sub><b>Alex</b></sub></a><br /><a href="https://github.com/thegreenwebfoundation/co2.js/commits?author=alexzurbonsen" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
