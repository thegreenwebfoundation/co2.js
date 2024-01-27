class ElectricityMapsApi {
  constructor(options) {
    this.baseUrl = "https://api-access.electricitymaps.com/free-tier/";
    this.apiKey = options.apiKey;
  }

  async getLatest(zone, lat, lon) {
    const url = `${this.baseUrl}/carbon-intensity/latest?lat=${lat}&lon=${lon}&zone=${zone}`;
    const response = await fetch(url);
    const data = await response.json();
    return { data };
  }

  async getHistory(zone, lat, lon, dataTime = undefined) {
    const url = `${this.baseUrl}/carbon-intensity/history?lat=${lat}&lon=${lon}&zone=${zone}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }

    if (dataTime) {
      try {
        return data.history.filter((d) => d.datetime === dataTime)[0];
      } catch {
        throw new Error(
          `No data for ${dataTime} in ${
            (zone | ("lat: " + lat), "lon: " + lon)
          }`
        );
      }
    }

    return data.history;
  }

  async getZones() {
    const url = `${this.baseUrl}/zones`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}

export { ElectricityMapsApi };
export default ElectricityMapsApi;
