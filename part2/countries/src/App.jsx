import { useState, useEffect } from 'react'
import axios from 'axios'

import Countries from './components/Countries'
import Filter from './components/Filter'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

  useEffect(() => {
    axios
      .get(`${baseUrl}?fields=name,capital,area,languages,flags`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} filterChangeHandler={handleFilterChange} />
      <Countries countries={countries} filter={filter}/>
    </div>
  )
}

export default App