const btn = document.getElementsByClassName("btn")[0];
const map = document.getElementById("mapLocation");
const lati_text = document.getElementsByClassName("laticont")[0];
const longi_text = document.getElementsByClassName("longicont")[0];
const container = document.getElementById("main");
const apidatasection = document.getElementById("apidata");

// weather Api details
let api;



btn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    container.classList.add("hide");


});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;

    lati_text.innerHTML = `Lat: ${latitude}`;
    longi_text.innerHTML = `Long: ${longitude}`;

    map.innerHTML = `<iframe
    src="https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed"
    width="100%"
    height="600px"
    frameborder="0"
    style="border: 0"
  ></iframe>`;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=49cc8c821cd2aff9af04c9f98c36eb74`)
        .then(e => e.json())
        .then(data => {
            // document.body.classList.add('main');

            console.log(data);

            document.querySelector("#location").textContent = "Location: " + data.name;
            document.querySelector("#WindSpeed").textContent = "Wind Speed: "+(data.wind.speed * 3.6) + " kmph";
            document.querySelector("#Humidity").textContent = "Humidity: "+ data.main.humidity;
            document.querySelector("#TimeZone").textContent = "Time Zone: " + secondsToTimeZoneString(data.timezone);
            document.querySelector("#Pressure").textContent = "Pressure: "+ data.main.pressure + " mb";
            document.querySelector("#WindDirection").textContent = "Wind Direction: " + degreesToWindDirection(data.wind.deg)
            document.querySelector("#FeelsLike").textContent = "Feels Like: " + data.main.feels_like;
        })
        .catch(e => {
            console.log(e);
        });

        const apidatasection = document.getElementById("apidata");
        apidatasection.classList.remove("hide");

    }

    function onError(error){
        alert("please allow Location access");
        console.log(error);

        container.classList.remove("hide");
    }

    const secondsToTimeZoneString = (offsetSeconds) => {
        const hours = Math.floor(offsetSeconds / 3600); 
        const minutes = Math.floor((offsetSeconds % 3600) / 60); 
        const sign = offsetSeconds < 0 ? '-' : '+';
        const formattedOffset = `${sign}${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return `UTC${formattedOffset}`;
    }
    const degreesToWindDirection = (degrees) => {
        const directions = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

