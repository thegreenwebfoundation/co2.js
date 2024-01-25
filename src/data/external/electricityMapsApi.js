class ElectricityMapsApi {
  constructor() {
    this.baseUrl = "https://api.electricitymap.org/v3";
  }

  async get(countryCode) {
    // const url = `${this.baseUrl}/country/latest/${countryCode}`;
    // const response = await fetch(url);
    // const data = await response.json();
    return { countryCode };
  }
}

export { ElectricityMapsApi };
export default ElectricityMapsApi;
