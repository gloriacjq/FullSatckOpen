import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weatherData, setWeather] = useState(null)

  // "capitalInfo":{"latlng":[60.17,24.93]}
  // "capital":["Helsinki"]

  // ($env:VITE_SOME_KEY={your_api_key}) -and (npm run dev) // for Windows Powershell
  const api_key = import.meta.env.VITE_SOME_KEY
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
  const query = `q=${city}&appid=${api_key}&units=metric`
  const url = `${baseUrl}?${query}`

  useEffect(() => {
    axios  
    .get(url)
    .then(response => {
      setWeather(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [query])

  if (!weatherData) {
    return null
  }
  const { weather, main, wind } = weatherData
  const temp = main.temp
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
  const speed = wind.speed
  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>temperature {temp} Celcius</p>
      <img src={iconUrl} />
      <p>wind {speed} m/s</p>
    </div>
  )
}

const Details = ({ country }) => {
  return (
    <>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <strong>languages:</strong>
        <ul>
          {Object.values(country.languages).map(l => 
            <li key={l}>{l}</li>)}
        </ul>
      <img src={country.flags.png} alt='flag' />
      <Weather city={country.capital[0]} />
    </>
  )
}

const Country = ({ id, country, toggleDetails }) => {
  const [showDetails, toggleShowDetails] = useState(toggleDetails)

  const handleToggler = () => {
    toggleShowDetails(!showDetails)
  }

  if (id === null) {
    return (
      <>
        <h2>{country.name.common}</h2>
        <Details country={country} />
      </>
    )
  }

  if(showDetails) {
    return (
      <>
        <li> {country.name.common} <button onClick={handleToggler}>hide</button> </li>
        <Details country={country} />
      </>
    )
  }

  return (
    <li> {country.name.common} <button onClick={handleToggler}>show</button> </li>
  )
  
  
}
  

export default Country