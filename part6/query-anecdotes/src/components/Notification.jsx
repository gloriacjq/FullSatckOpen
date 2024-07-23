import { useContext } from 'react'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const message = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return message !== null 
  ? (
    <div style={style}>
      {message}
    </div>
  )
  : null
}

export default Notification
