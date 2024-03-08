/**
 * Type definition for the options of the ElectricityMapsApi.
 * @typedef {Object} ElectricityMapsApiOptions
 * @property {string} authToken - The authentication token for the API.
 */

/**
 *  @typedef {Object} LatestData
 * @property {string} zone - The zone identifier.
 * @property {number} carbonIntensity - The carbon intensity value.
 * @property {string} datetime - The date and time of the data.
 * @property {string} updatedAt - The date and time the data was last updated.
 * @property {string} createdAt - The date and time the data was created.
 * @property {string} emissionFactorType - The type of emission factor used.
 * @property {boolean} isEstimated - Whether the data is estimated.
 * @property {string} estimationMethod - The method used to estimate the data.
 */

/**
 * @typedef {Object} ZoneData
 * @property {string} countryName - The name of the country the zone belongs to.
 * @property {string} zoneName - The zone identifier.
 * @property {string[]} access - an array of strings listing the API endpoints the zone can be accessed from
 */

/**
 * @typedef {Object} HistoryData
 * @property {Object[]} history - An array of historical data.
 * @property {string} history.zone - The zone identifier.
 * @property {number} history.carbonIntensity - The carbon intensity value.
 * @property {string} history.datetime - The date and time of the data.
 * @property {string} history.updatedAt - The date and time the data was last updated.
 * @property {string} history.createdAt - The date and time the data was created.
 * @property {string} history.emissionFactorType - The type of emission factor used.
 * @property {boolean} history.isEstimated - Whether the data is estimated.
 * @property {string} history.estimationMethod - The method used to estimate the data.
 */

class ElectricityMapsApi {
  /**
   * Create an instance of ElectricityMapsApi.
   * @param {ElectricityMapsApiOptions} options - The options for the ElectricityMapsApi.
   */
  constructor(options) {
    /**
     * @type {string} The base URL of the API.
     */
    this.baseUrl = "https://api-access.electricitymaps.com/free-tier";

    /**
     * @type {string} The authentication token for the API.
     */
    this.authToken = options?.authToken || undefined;

    /**
     * @type {string} The name of the API.
     */
    this.name = "Electricity Maps API - Free Tier";

    /**
     * @type {string} The documentation URL of the API.
     */
    this.docs = "https://static.electricitymaps.com/api/docs/index.html";
  }

  /**
   * Fetches the latest grid intensity data from the API.
   * @param {string} zone - The zone identifier.
   * @param {string} lat - The latitude of the location.
   * @param {string} lon - The longitude of the location.
   * @returns {Promise<LatestData>} A promise that resolves with the latest grid intensity data.
   * @throws {Error} Will throw an error if the authentication token is not provided.
   * @throws {Error} Will throw an error if the zone or lat & lon are not provided.
   */
  async getLatest(zone, lat, lon) {
    if (!this.authToken || this.authToken === undefined) {
      throw new Error(
        "An authentication token is required to access this endpoint."
      );
    }

    if (!zone && (!lat || !lon)) {
      throw new Error(
        "Either a zone or a latitude and longitude value is required."
      );
    }

    const query = `${lat ? `lat=${lat}&` : ""}${lon ? `lon=${lon}&` : ""}${
      zone ? `zone=${zone}` : ""
    }`;
    const url = `${this.baseUrl}/carbon-intensity/latest?${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": this.authToken,
      },
    });
    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }

    return { data };
  }

  /**
   * Fetches the historical grid intensity data from the API.
   * @param {string} zone - The zone identifier.
   * @param {string} lat - The latitude of the location.
   * @param {string} lon - The longitude of the location.
   * @returns {Promise<HistoryData>} A promise that resolves with the historical grid intensity data.
   * @throws {Error} Will throw an error if the authentication token is not provided.
   * @throws {Error} Will throw an error if the zone or lat & lon are not provided.
   */

  async getHistory(zone, lat, lon) {
    if (!this.authToken || this.authToken === undefined) {
      throw new Error(
        "An authentication token is required to access this endpoint."
      );
    }

    if (!zone && (!lat || !lon)) {
      throw new Error(
        "Either a zone or a latitude and longitude value is required."
      );
    }

    const query = `${lat ? `lat=${lat}&` : ""}${lon ? `lon=${lon}&` : ""}${
      zone ? `zone=${zone}` : ""
    }`;

    const url = `${this.baseUrl}/carbon-intensity/history?${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": this.authToken,
      },
    });
    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }

    return data.history;
  }

  /**
   * Fetches the zone data from the API.
   * @returns {Promise<ZoneData[]>} A promise that resolves with the data for all zones.
   */
  async getZones() {
    const url = `${this.baseUrl}/zones`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}

export { ElectricityMapsApi };
export default ElectricityMapsApi;
