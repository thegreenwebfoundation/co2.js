class ElectricityMapsApi {
  constructor(options) {
    this.baseUrl = "https://api-access.electricitymaps.com/free-tier";
    this.authToken = options?.authToken || undefined;
  }

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

  async getHistory(zone, lat, lon) {
    if (!this.authToken || this.authToken === undefined) {
      throw new Error(
        "An authentication token is required to access this endpoint."
      );
    }

    if (!zone && (!lat || !lon)) {
      console.log(zone, lat, lon);
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

  async getZones() {
    const url = `${this.baseUrl}/zones`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}

export { ElectricityMapsApi };
export default ElectricityMapsApi;
