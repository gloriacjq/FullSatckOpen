const Notification = ({ message, errorFlag }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={ errorFlag ? 'error' : 'success' }>
      {message}
    </div>
  )
}

export default Notification