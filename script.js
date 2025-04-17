document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container")
    const search = document.querySelector(".search-box button:not(.geolocation-btn)")
    const geoLocationBtn = document.querySelector(".geolocation-btn")
    const weatherBox = document.querySelector(".weather-box")
    const weatherDetails = document.querySelector(".weather-details")
    const error404 = document.querySelector(".not-found")
    const weatherElement = document.querySelector(".weather")
    const hourlyForecast = document.querySelector(".hourly-forecast")
    const dailyForecast = document.querySelector(".daily-forecast")
    const threeHourForecast = document.querySelector(".three-hour-forecast")
  
    
    const apiKey = "f085a7a9ce451c1300520c27309a03f4"
  
    
    function fetchWeatherData(city) {
      
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=fr`)
        .then((response) => response.json())
        .then((json) => {
          if (json.cod === "404") {
            showError()
            return
          }
  
          hideError()
          displayCurrentWeather(json)
  
          
          const { lat, lon } = json.coord
          fetchForecastData(lat, lon)
          fetch3HourForecast(lat, lon)
        })
        .catch(() => {
          showError()
        })
    }
  
    
    function fetch3HourForecast(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=fr`)
        .then((response) => response.json())
        .then((data) => {
          
          const forecastItems = data.list.slice(0, 8)
          display3HourForecast(forecastItems)
        })
        .catch((err) => {
          console.error("Error fetching 3-hour forecast data:", err)
        })
    }
  
    
    function display3HourForecast(forecastData) {
      const threeHourContainer = document.querySelector(".three-hour-container")
      const threeHourForecast = document.querySelector(".three-hour-forecast")
  
      threeHourContainer.innerHTML = ""
  
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  
      forecastData.forEach((item, index) => {
        const date = new Date(item.dt * 1000)
        const dayName = days[date.getDay()]
        const hours = date.getHours()
        const formattedHours = hours < 10 ? `0${hours}:00` : `${hours}:00`
  
        
        const now = new Date()
        const isToday =
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
  
        const dateDisplay = isToday ? "Aujourd'hui" : dayName
  
        const threeHourItem = document.createElement("div")
        threeHourItem.classList.add("three-hour-item")
  
        
        if (index === 0) {
          threeHourItem.classList.add("next-hours")
        }
  
        
        const precipProb = item.pop ? Math.round(item.pop * 100) : 0
  
        threeHourItem.innerHTML = `
        <div class="day">${dateDisplay}</div>
        <div class="date-time">${formattedHours}</div>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
        <div class="temp">${Math.round(item.main.temp)}°C</div>
        <div class="description">${item.weather[0].description}</div>
        <div class="details">
          <div class="humidity">
            <i class="fa-solid fa-water"></i>
            <span>${item.main.humidity}%</span>
          </div>
          <div class="precipitation">
            <i class="fa-solid fa-droplet"></i>
            <span>${precipProb}%</span>
          </div>
          <div class="wind">
            <i class="fa-solid fa-wind"></i>
            <span>${Math.round(item.wind.speed)}</span>
          </div>
        </div>
      `
  
        threeHourContainer.appendChild(threeHourItem)
      })
  
      threeHourForecast.classList.remove("hidden")
    }
  
    
    function fetchForecastData(lat, lon) {
      
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}&lang=fr`,
      )
        .then((response) => response.json())
        .then((json) => {
          displayHourlyForecast(json.hourly.slice(0, 8)) 
          displayDailyForecast(json.daily.slice(1, 6)) 
        })
        .catch((err) => {
          console.error("Error fetching forecast data:", err)
        })
    }
  
    
    function displayCurrentWeather(data) {
      const image = document.querySelector(".weather img")
      const temperature = document.querySelector(".weather .temperature")
      const description = document.querySelector(".weather .description")
      const humidity = document.querySelector(".humidity span")
      const wind = document.querySelector(".wind span")
  
      image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      temperature.innerHTML = `${Number.parseInt(data.main.temp)}<span>°C</span>`
      description.innerHTML = data.weather[0].description
      humidity.innerHTML = `${data.main.humidity}%`
      wind.innerHTML = `${Number.parseInt(data.wind.speed)} km/h`
  
      weatherElement.classList.remove("hidden")
    }
  
    
    function displayHourlyForecast(hourlyData) {
      const hourlyContainer = document.querySelector(".hourly-container")
      hourlyContainer.innerHTML = ""
  
      hourlyData.forEach((item, index) => {
        const time = new Date(item.dt * 1000)
        const hour = time.getHours()
        const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`
  
        
        const now = new Date()
        const hoursFromNow = Math.round((time - now) / (1000 * 60 * 60))
  
        
        let timeDisplay = formattedHour
        if (hoursFromNow === 1) {
          timeDisplay = "Dans 1h"
        } else if (hoursFromNow > 1 && hoursFromNow < 6) {
          timeDisplay = `Dans ${hoursFromNow}h`
        }
  
        const hourlyItem = document.createElement("div")
        hourlyItem.classList.add("hourly-item")
  
        
        if (index < 3) {
          hourlyItem.classList.add("next-hours")
        }
  
        
        const precipProb = item.pop ? Math.round(item.pop * 100) : 0
        const precipHTML =
          precipProb > 0 ? `<div class="precipitation"><i class="fa-solid fa-droplet"></i>${precipProb}%</div>` : ""
  
        hourlyItem.innerHTML = `
          <div class="hour">${timeDisplay}</div>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
          <div class="temp">${Math.round(item.temp)}°C</div>
          <div class="description">${item.weather[0].description}</div>
          ${precipHTML}
        `
        hourlyContainer.appendChild(hourlyItem)
      })
  
      hourlyForecast.classList.remove("hidden")
    }
  
    
    function displayDailyForecast(dailyData) {
      const dailyContainer = document.querySelector(".daily-container")
      dailyContainer.innerHTML = ""
  
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  
      dailyData.forEach((item, index) => {
        const date = new Date(item.dt * 1000)
        const dayName = days[date.getDay()]
  
        const dailyItem = document.createElement("div")
        dailyItem.classList.add("daily-item")
        dailyItem.innerHTML = `
                  <div class="day">${dayName}</div>
                  <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                  <div class="temp">${Number.parseInt(item.temp.day)}°C</div>
                  <div class="description">${item.weather[0].description}</div>
              `
        dailyContainer.appendChild(dailyItem)
      })
  
      dailyForecast.classList.remove("hidden")
    }
  
    
    function showError() {
      weatherElement.classList.add("hidden")
      hourlyForecast.classList.add("hidden")
      dailyForecast.classList.add("hidden")
      document.querySelector(".three-hour-forecast").classList.add("hidden")
      error404.style.display = "block"
      container.style.height = "400px"
    }
  
    
    function hideError() {
      error404.style.display = "none"
      container.style.height = "auto"
    }
  
    
    search.addEventListener("click", () => {
      const city = document.querySelector(".search-box input").value
      if (city === "") return
      fetchWeatherData(city)
    })
  
    
    document.querySelector(".search-box input").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const city = document.querySelector(".search-box input").value
        if (city === "") return
        fetchWeatherData(city)
      }
    })
  
    
    geoLocationBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
  
            
            fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.length > 0) {
                  const cityName = data[0].name
                  document.querySelector(".search-box input").value = cityName
                  fetchWeatherData(cityName)
                }
              })
              .catch((err) => {
                console.error("Error getting location name:", err)
              })
          },
          (error) => {
            console.error("Error getting location:", error)
            alert("Impossible d'obtenir votre position. Veuillez autoriser l'accès à la géolocalisation.")
          },
        )
      } else {
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.")
      }
    })
  
    
    fetchWeatherData("Paris")
  })
  