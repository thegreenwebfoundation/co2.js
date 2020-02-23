# CO2

We know computers use electricity, and because most of the electricity we use comes from burning fossil fuels to generate, there is an environmental cost to every upload and download we make over the internet.

The CO2 package from The Green Web Foundation lets you quickly estimate these emissions, to allow people who build digital services to optimise for carbon, the same way we use performance budgets to optimise our software.

It does this by implementing the 1byte model as used by the Shift Project, as introduced in their report on CO3 emission from digital infrastructure, [Lean ICT: for a sober digital], to return a number for the estimated Co2 emissions for the corresponding number of bytes sent over the wire.

It is currently used in the web performance tool sitespeed.io, to help developers build greener, more planet friendly digital services.

[soberDigital]: https://theshiftproject.org/en/lean-ict-2/


## Usage

```js

const co2 = require('@tgwf/co2')
const bytesSent = 1_000_000

estimatedCO2 = co2.perByte(bytesSent)

console.log(`Sending a million bytes, had a carbon footprint of ${estimatedCO2.toFixed(3)} grams of CO2`)

```

# Licenses

Apache 2.0