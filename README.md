# CO2

<img src="https://travis-ci.org/thegreenwebfoundation/co2.js.svg?branch=master" />

We know computers use electricity, and because most of the electricity we use comes from burning fossil fuels to generate, there is an environmental cost to every upload and download we make over the internet.

The CO2 package from [The Green Web Foundation][tgwf] lets you quickly estimate these emissions, to allow people who build digital services to optimise for carbon, the same way we use performance budgets to optimise our software.

It does this by implementing the 1byte model as used by the Shift Project, as introduced in their report on CO2 emissions from digital infrastructure, [Lean ICT: for a sober digital][soberDigital], to return a number for the estimated CO2 emissions for the corresponding number of bytes sent over the wire.

It is currently used in the web performance tool [sitespeed.io], to help developers build greener, more planet friendly digital services.

[soberDigital]: https://theshiftproject.org/en/lean-ict-2/
[sitespeedio]: https://sitespeed.io/
[tgwf]: https://www.thegreenwebfoundation.org/


## Usage

```js

const CO2 = require('@tgwf/co2')
const bytesSent = 1_000_000
const co2Emission = new CO2();
estimatedCO2 = co2Emission.perByte(bytesSent)

console.log(`Sending a million bytes, had a carbon footprint of ${estimatedCO2.toFixed(3)} grams of CO2`)

```

Because different digital services and websites use different forms of power, there is also a module for checking if a domain uses green power or not, and whether the domains linked to on a page use green power as well.

```js

const greencheck = require('@tgwf/hosting')

greencheck.check("google.com") // returns true if green, otherwise false
greencheck.check(["google.com", "kochindustries.com"]) // returns an array of the green domains, in this case ["google.com"]
greencheck.checkPage(["google.com"]) // returns an array of green domains, again in this case, ["google.com"]

```

# Licenses

Apache 2.0
