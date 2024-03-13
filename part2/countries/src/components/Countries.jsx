import Country from './Country'

const Countries = ({ countries, filter, onButtonClick }) => {
  const filtedCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase()))
  
  const numberOfCountries = filtedCountries.length

  if (numberOfCountries > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (numberOfCountries === 1) {
    return (
      <Country id={null} country={filtedCountries[0]} toggleDetails={true}/>
    )
  } else {
    return (
      <ul>
        {filtedCountries.map(country => 
          <Country key={country.name.official} id={country.name.common} country={country} toggleDetails={false}/>
        )}
      </ul>
    )
  }
    

}


export default Countries
