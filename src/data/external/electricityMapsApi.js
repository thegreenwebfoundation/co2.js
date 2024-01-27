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

  async getHistory(zone, lat, lon, dataTime = undefined) {
    if (!this.authToken || this.authToken === undefined) {
      throw new Error(
        "An authentication token is required to access this endpoint."
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
