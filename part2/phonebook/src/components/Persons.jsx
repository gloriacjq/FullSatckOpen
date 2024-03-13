const Persons = ({persons, filter, onButtonClick}) => 
  <ul>
    {persons
      .filter((person) => 
        person.name.toLowerCase().includes(filter.toLowerCase()))
      .map((person) => 
        <li key={person.id}>{person.name} {person.number} <button onClick={() => onButtonClick(person)}>delete</button> </li>)
    }
  </ul>

export default Persons
