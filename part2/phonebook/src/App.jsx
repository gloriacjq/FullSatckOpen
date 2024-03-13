import { useState, useEffect } from 'react'

import personService from './services/persons'

import PersonForm from './components/PersonForm' 
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorFlag, setErrorFlag] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const checkPersonExistence = (name) => {
    return persons.some((person) => person.name.toLowerCase() === name.toLowerCase())
  }

  const showNotification = (message) => {
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(null), 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if(checkPersonExistence(newName)) {
      // alert(`${newName} is already added to phonebook`)
      // const id = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase()).id
      const person = persons.find(p => p.name === newName)
      updatePerson(person.id)
    } else {
      const personObject = { 
        name : newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          const message = `Added ${newName}`
          setErrorFlag(false)
          showNotification(message)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const updatePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const changedPerson = { ...person, number: newNumber}
    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== id? p : returnedPerson))
          const message = `Changed the number of ${person.name}`
          setErrorFlag(false)
          showNotification(message)
        })
        .catch(error => {
          const message =  `Information of ${person.name} has already been removed from server`
          setErrorFlag(true)
          showNotification(message)
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Do you want to delete ${person.name}?`)) {
      personService.remove(person.id)
      setPersons(persons.filter(p => p.id !== person.id))
      const message = `Deleted ${person.name}`
      setErrorFlag(false)
      showNotification(message)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} errorFlag={errorFlag} />
      <Filter filter={newFilter} filterChangeHandler={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson} 
        nameValue={newName} 
        nameChangeHandler={handleNameChange} 
        numberValue={newNumber} 
        numberChangeHandler={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} onButtonClick={deletePerson}/>
    </div>
  )
}

export default App