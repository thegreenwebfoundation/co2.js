# CO2

<img src="https://github.com/thegreenwebfoundation/co2.js/actions/workflows/unittests.yml/badge.svg" />


We know computers use electricity, and because most of the electricity we use comes from burning fossil fuels, there is an environmental cost to every upload and download we make over the internet.

We can do something about this though. The same way we use performance budgets to make apps and websites faster and cheaper to run, we can use carbon budgets to make them faster, cheaper and _greener_.

The CO2 package from [The Green Web Foundation][tgwf] lets you quickly estimate these emissions, to make measurable improvements as part of your workflow.

### How it works

It does this by implementing various models for converting the measurable usage of digital services into a figure for the estimated CO2 emissions.

This defaults to the 1byte model as used by the Shift Project, as introduced in their report on CO2 emissions from digital infrastructure, [Lean ICT: for a sober digital][soberDigital], with the [Sustainable Web Design model][swd] as a popular alternative..

For more information, see the documentation [for when to use the different models, with code samples to start you off](./src/readme.md).

### Who uses it

It is currently used in the web performance tool [sitespeed.io][], [ecoping][], [Websitecarbon.com](websitecarbon), and [ecograder][] to help developers build greener, more planet friendly digital services.

If you want to build this kind of environmental information into your own software, and want some advice, we'd be happy to hear from you - please open an issue, remembering to link to your project.

This is open source software, with all the guarantees associated. So if you want professional advice, to a deadline, and you have a budget please see the services offered by the [Green Web Foundation][tgwf-services].


[sitespeed.io]: https://sitespeed.io
[ecoping]: https://ecoping.earth
[ecograder]: https://ecograder.com
[websitecarbon]: https://www.websitecarbon.com
[tgwf]: https://www.thegreenwebfoundation.org
[tgwf-services]: https://www.thegreenwebfoundation.org/services
[swd]: https://sustainablewebdesign.org/calculating-digital-emissions
[soberDigital]: https://theshiftproject.org/en/lean-ict-2/


## Usage

### Calculating emissions per byte

#### Server-side

This approach relies on the `fs` module and so can only be used on platforms like Node.js, that support this.

```js

const CO2 = require('@tgwf/co2')
const bytesSent = (1024 * 1024 * 1024)
const co2Emission = new CO2();
estimatedCO2 = co2Emission.perByte(bytesSent)

console.log(`Sending a gigabyte, had a carbon footprint of ${estimatedCO2.toFixed(3)} grams of CO2`)

```

#### Browser-side

For browser-based solutions, you must import the `co2.js` submodule directly from `node_modules`. For example, like this:

```js

const CO2 = require('/@tgwf/co2/src/co2.js')
const bytesSent = (1024 * 1024 * 1024)
const co2Emission = new CO2();
estimatedCO2 = co2Emission.perByte(bytesSent)

console.log(`Sending a gigabyte, had a carbon footprint of ${estimatedCO2.toFixed(3)} grams of CO2`)
****
```

### Checking for green power

Because different digital services and websites use different forms of power, there is also a module for checking if a domain uses green power or not, and whether the domains linked to on a page use green power as well.

```js

const greencheck = require('@tgwf/hosting')

// returns true if green, otherwise false
greencheck.check("google.com")

// returns an array of the green domains, in this case ["google.com"].
greencheck.check(["google.com", "kochindustries.com"])]

// returns an array of green domains, again in this case, ["google.com"]
greencheck.checkPage(["google.com"])

```

# Licenses

Apache 2.0
