import React from 'react'

const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }
  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (success) {
    notificationStyle.color = 'green'
  }
  return (
    <div style={notificationStyle} className="notification">
      {message}
    </div>
  )
}
export default Notification
