/**
 * @typedef ModelOptionsSegmentCountry
 * @property {string} country
 *
 * @typedef ModelOptionsGridIntensity
 * @property {number | ModelOptionsSegmentCountry} device
 *   A number representing the carbon intensity for the given segment (in grams per kilowatt-hour).
 *   Or, an object, which contains a key of country and a value that is an Alpha-3 ISO country code.
 * @property {number | ModelOptionsSegmentCountry} dataCenter
 *   A number representing the carbon intensity for the given segment (in grams per kilowatt-hour).
 *   Or, an object, which contains a key of country and a value that is an Alpha-3 ISO country code.
 * @property {number | ModelOptionsSegmentCountry} network
 *   A number representing the carbon intensity for the given segment (in grams per kilowatt-hour).
 *   Or, an object, which contains a key of country and a value that is an Alpha-3 ISO country code.
 *
 * @typedef ModelOptions
 * @property {ModelOptionsGridIntensity=} gridIntensity Segment-level description of the grid carbon intensity.
 * @property {number=} dataReloadRatio A number between 0 and 1 representing the percentage of data that is downloaded by return visitors.
 * @property {number=} returnVisitPercentage A number between 0 and 1 representing the percentage of returning visitors.
 * @property {number=} firstVisitPercentage A number between 0 and 1 representing the percentage of new visitors.
 *
 * @typedef ModelAdjustmentSegment
 * @property {number} value
 * @property {string=} country
 *
 * @typedef ModelAdjustmentsGridIntensity
 * @property {ModelAdjustmentSegment} device
 * @property {ModelAdjustmentSegment} dataCenter
 * @property {ModelAdjustmentSegment} network
 *
 * @typedef ModelAdjustments
 * @property {ModelAdjustmentsGridIntensity} gridIntensity
 * @property {number} dataReloadRatio
 * @property {number} returnVisitPercentage
 * @property {number} firstVisitPercentage
 *
 * @typedef TraceResultsGridIntensity
 * @property {string} description
 * @property {number} device
 * @property {number} dataCenter
 * @property {number} network
 * @property {number} production
 *
 * @typedef TraceResultVariables
 * @property {string} description
 * @property {number} bytes
 * @property {TraceResultsGridIntensity} gridIntensity
 * @property {number=} dataReloadRatio
 * @property {number=} firstVisitPercentage
 * @property {number=} returnVisitPercentage
 *
 * @typedef CO2EstimateTraceResultPerByte
 * @property {number | CO2ByComponentWithTotal} co2 - The CO2 estimate in grams/kilowatt-hour or its separate components
 * @property {boolean} green - Whether the domain is green or not
 * @property {TraceResultVariables} variables - The variables used to calculate the CO2 estimate
 *
 * @typedef CO2EstimateTraceResultPerVisit
 * @property {number | AdjustedCO2ByComponentWithTotal} co2 - The CO2 estimate in grams/kilowatt-hour or its separate components
 * @property {boolean} green - Whether the domain is green or not
 * @property {TraceResultVariables} variables - The variables used to calculate the CO2 estimate
 *
 * @typedef TraceResultVariablesPerByte
 * @property {GridIntensityVariables} gridIntensity - The grid intensity related variables
 *
 * @typedef TraceResultVariablesPerVisit
 * @property {GridIntensityVariables} gridIntensity - The grid intensity related variables
 * @property {number} dataReloadRatio - What percentage of a page is reloaded on each subsequent page view
 * @property {number} firstVisitPercentage - What percentage of visits are loading this page for subsequent times
 * @property {number} returnVisitPercentage - What percentage of visits are loading this page for the second or more time
 *
 * @typedef GridIntensityVariables
 * @property {string} description - The description of the variables
 * @property {number} network - The network grid intensity set by the user or the default
 * @property {number} dataCenter - The data center grid intensity set by the user or the default
 * @property {number} device - The device grid intensity set by the user or the default
 * @property {number} production - The production grid intensity set by the user or the default
 *
 * @typedef EnergyByComponent
 * @property {number} consumerDeviceEnergy
 * @property {number} networkEnergy
 * @property {number} productionEnergy
 * @property {number} dataCenterEnergy
 *
 * @typedef {Object} AdjustedEnergyByComponent
 * @type {{
 *   [K in keyof EnergyByComponent as `${K} - first`]: EnergyByComponent[K]
 * } & {
 *   [K in keyof EnergyByComponent as `${K} - subsequest`]: EnergyByComponent[K]
 * }}
 *
 * @typedef CO2ByComponent
 * @property {number} consumerDeviceCO2
 * @property {number} networkCO2
 * @property {number} productionCO2
 * @property {number} dataCenterCO2
 *
 * @typedef {Object} AdjustedCO2ByComponent
 * @type {{
 *   [K in keyof CO2ByComponent as `${K} - first`]: CO2ByComponent[K]
 * } & {
 *   [K in keyof CO2ByComponent as `${K} - subsequest`]: CO2ByComponent[K]
 * }}
 *
 * @typedef CO2ByComponentWithTotal
 * @property {number} consumerDeviceCO2
 * @property {number} networkCO2
 * @property {number} productionCO2
 * @property {number} dataCenterCO2
 * @property {number} total
 *
 * @typedef {Object} AdjustedCO2ByComponentWithTotal
 * @type {AdjustedCO2ByComponent & { total: number }}
 *
 * @typedef PageXRayDomain
 * @property {number} transferSize
 *
 * @typedef PageXRayAsset
 * @property {string} url
 * @property {number} transferSize
 * @property {string} type
 *
 * @typedef PageXRay
 * @property {Record<string, PageXRayDomain>} domains
 * @property {PageXRayAsset[]} assets
 * @property {RegExp} firstPartyRegEx
 *
 * @typedef CO2PerDomain
 * @property {string} domain
 * @property {number} co2
 * @property {number} transferSize
 *
 * @typedef CO2PerContentType
 * @property {string} type
 * @property {number} co2
 * @property {number} transferSize
 *
 * @typedef CO2PerContentAsset
 * @property {string} url
 * @property {number} co2
 * @property {number} transferSize
 *
 * @typedef PerDomainCheckResponse
 * @property {string} url
 * @property {boolean} green
 *
 * @typedef MultiDomainCheckResponse
 * @type {Record<string, PerDomainCheckResponse>}
 */
