import React from 'react'
import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
const Notification = () => {
  const notificationData = useSelector(({ notification }) => notification)
  if (notificationData === null) {
    return null
  }
  return (
    <Alert
      className="notification"
      variant={notificationData.success ? 'success' : 'danger'}
    >
      {notificationData.content}
    </Alert>
  )
}
export default Notification
