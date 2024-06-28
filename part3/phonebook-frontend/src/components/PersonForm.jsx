const PersonForm = ({onSubmit, nameValue, nameChangeHandler, numberValue, numberChangeHandler}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={nameChangeHandler} />
      </div>
      <div>
        number: <input value={numberValue} onChange={numberChangeHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  ) 
}

export default PersonForm