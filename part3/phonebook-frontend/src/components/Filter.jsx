const Filter = ({ filter, filterChangeHandler }) =>
  <>
    filter shown with <input value={filter} onChange={filterChangeHandler} />
  </>

export default Filter