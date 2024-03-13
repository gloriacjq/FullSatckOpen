const Filter = ({ filter, filterChangeHandler }) =>
  <>
    find countries <input value={filter} onChange={filterChangeHandler} />
  </>

export default Filter