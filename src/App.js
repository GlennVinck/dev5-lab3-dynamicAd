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
      `https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&current=temperature_2m,is_day,rain,snowfall,cloud_cover&timezone=Europe%2FLondon&forecast_days=1`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.querySelector("#temp").innerHTML =
          data.current.temperature_2m + "°C";

        let weather;
        if (data.current.rain > 0) {
          weather = "rainy";
        } else if (data.current.cloud_cover > 50) {
          weather = "cozy+coffee";
        } else {
          weather = "sunny";
        }

        if (data.current.rain > 0) {
          document.querySelector("#rainornot").innerHTML = weather;
        } else if (data.current.cloud_cover > 50) {
          document.querySelector("#rainornot").innerHTML = "cloudy";
        } else {
          document.querySelector("#rainornot").innerHTML = weather;
        }

        this.getPlaylist(weather);
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

  async getPlaylist(weather) {
    try {
      const token = await this.spotifyApiToken();

      //url: https://api.spotify.com/v1/search?q=rainy&type=playlist
      //fetch, then log result
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${weather}&type=playlist`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      const { playlistUrl, playlistName, playlistImage } =
        this.getRandomPlaylist(data);
      this.displayPlaylist(playlistName, playlistImage);
      this.clickablePlaylist(playlistUrl);
    } catch (error) {
      console.error("Error getting playlist:", error);
    }
  }

  getRandomPlaylist(data) {
    //choose random playlist
    let random = Math.floor(Math.random() * 20);
    console.log(random);
    let playlistId = data.playlists.items[random].id;
    let playlistUrl = data.playlists.items[random].external_urls.spotify;
    let playlistName = data.playlists.items[random].name;
    let playlistImage = data.playlists.items[random].images[0].url;
    console.log(playlistId, playlistUrl, playlistName, playlistImage);

    return { playlistUrl, playlistName, playlistImage };
  }

  displayPlaylist(playlistName, playlistImage) {
    //display playlist in DOM
    document.querySelector(".playlist-title").innerHTML = playlistName;
    document.querySelector(".playlist-img").src = playlistImage;
  }

  clickablePlaylist(playlistUrl) {
    //make .playlist-img clickable
    document.querySelector(".playlist-img").addEventListener("click", () => {
      window.open(playlistUrl);
    });
  }
}
