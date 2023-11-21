export default class App {
  constructor() {
    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
  }
  showPosition(position) {
    let x = position.coords.latitude;
    let y = position.coords.longitude;
    this.getWeather(x, y);
  }
  getWeather(x, y) {
    //url: https://api.open-meteo.com/v1/forecast?latitude=51&longitude=4&hourly=temperature&current_weather=true&forecast_days=1
    //fetch, then log result
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&hourly=temperature&current_weather=true&forecast_days=1`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.querySelector("h2").innerHTML =
          data.current_weather.temperature + "°C";
        this.getPlaylist();
      });
  }

  async spotifyApiToken() {
    const client_id = "9b548fcdf56845ea9a9578fa34a7a2bd";
    const client_secret = "c778bda310ef4817bc6a1e110fbe4bf0";

    try {
      const response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(client_id + ":" + client_secret),
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();
      console.log(data);
      return data.access_token;
    } catch (error) {
      console.error("Error getting Spotify API token:", error);
      throw error; // Re-throw the error to be caught by the calling function
    }
  }

  async getPlaylist() {
    try {
      const token = await this.spotifyApiToken();

      //url: https://api.spotify.com/v1/search?q=rainy&type=playlist
      //fetch, then log result
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=rainy&type=playlist`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error getting playlist:", error);
    }
  }
}
