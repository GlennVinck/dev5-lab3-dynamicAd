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
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&hourly=temperature&current_weather=true&forecast_days=1`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.querySelector('h2').innerHTML = data.current_weather.temperature + '°C';
            });
    }
}