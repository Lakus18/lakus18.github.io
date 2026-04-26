console.debug("Hello world!");

function getOutfitAdvice(temp) {
  if (temp <= 10) return "Zimno! Ubierz się ciepło - kurtka i czapka koniecznie";
  if (temp < 15) return "Chłodno! przyda się cieplejsza bluza lub lekka kurtka";
  if (temp < 22) return "Ciepło! Idealnie na lekką bluzę i spodnie";
  return "Gorąco! Załóż krótkie spodenki i koszulkę!";
}

function fetchWeather() {
  const address = document.getElementById("address").value;

  if (!address) {
    alert("Nie podano adresu");
    return;
  }

  const xmlhr = new XMLHttpRequest();
  const xmlhrKey = "25e69ad4058025984854b30506380c90";
  const xmlhrUrl = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${xmlhrKey}&units=metric`;

  xmlhr.open("GET", xmlhrUrl, true);

  xmlhr.onload = function () {
    if (xmlhr.status === 200) {
      const data = JSON.parse(xmlhr.responseText);
      console.log("Dzisiejsza pogoda");
      console.log(JSON.stringify(data, null, 2));

      const temp = Math.round(data.main.temp);
      document.getElementById("todaysResult").innerHTML = `
        <p><strong>📍 Miasto:</strong> ${data.name}, ${data.sys.country}</p>
        <p>🌡️ <strong>Temperatura:</strong> ${data.main.temp}°C</p>
        <p>🧊 <strong>Odczuwalna:</strong> ${data.main.feels_like}°C</p>
        <p>🌤️ <strong>Pogoda:</strong> ${data.weather[0].description}</p>
        <p>💧 <strong>Wilgotność:</strong> ${data.main.humidity}%</p>
        <p>💨 <strong>Wiatr:</strong> ${data.wind.speed} m/s</p>
        <p>🌅 <strong>Wschód:</strong> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
        <p>🌇 <strong>Zachód:</strong> ${new Date(data.sys.sunset * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
        <div class="outfit-advice">💡 <strong>Propozycja:</strong> ${getOutfitAdvice(data.main.temp)}</div>
       `;
    } else {
      console.error("Błąd: ", xmlhr.status);
      document.getElementById("todaysResult").innerHTML = `
        <p><strong>Błąd ${xmlhr.status}</strong></p>
        <p>Nie można pobrać danych dla miasta <strong>${address}</strong></p>
      `;
    }
  };

  xmlhr.onerror = function() {
    console.error("Błąd połączenia");
    document.getElementById("todaysResult").innerHTML = `<p>Błąd połączenia</p>`;
  };

  xmlhr.send();

  ///////////////////////////////////////////////////////////////////////////////////////////

  const fetchKey = "25e69ad4058025984854b30506380c90";
  const fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${address}&appid=${fetchKey}&units=metric`;

  fetch(fetchUrl).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Błąd: ${response.status}`);
    }
  }).then(data => {
    console.log("Pogoda w najbliższych dniach");
    console.log(JSON.stringify(data, null, 2));

    let forecastHTML = "<div class='forecast-blocks'>";
    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt * 1000);

      let sumTemp = 0;
      let count = 0;
      for (let j = i; j < Math.min(i + 8, data.list.length); j++) {
        sumTemp += data.list[j].main.temp;
        count++;
      }
      const avgTemp = sumTemp / count;

      forecastHTML += `
        <div class="forecast-block">
            <span class="date">${date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' })}</span>
            <div class="temp">${Math.round(forecast.main.temp)}°C</div>
            <p class="desc">${forecast.weather[0].description}</p>
            <p>💨 ${forecast.wind.speed} m/s</p>
            <p>🌡️ ${Math.round(forecast.main.feels_like)}°C (odcz.)</p>
            <p>💧 ${forecast.main.humidity}%</p>
            <div class="outfit-advice" style="font-size: 0.85rem; padding: 8px; margin-top: 10px;">💡 ${getOutfitAdvice(Math.round(avgTemp))}</div>
        </div>
      `;
    }
    forecastHTML += "</div>";

    document.getElementById("forecastResult").innerHTML = forecastHTML;
  }).catch(error => {
    console.error("Błąd fetch: ", error);
    document.getElementById("forecastResult").innerHTML = `
        <p><strong>Błąd</strong></p><p>${error.message}</p>
        <p>Nie można pobrać prognozy dla miasta <strong>${address}</strong></p>
    `;
  });
}

document.getElementById("weatherBtn").addEventListener("click", fetchWeather);
document.getElementById("address").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchWeather();
  }
});
