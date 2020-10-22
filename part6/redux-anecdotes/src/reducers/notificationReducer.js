const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION': {
      return action.content
    }
    default:
      return state
  }
}

let timeout = null
export const setNotification = (text, seconds) => {
  return dispatch => {
    window.clearTimeout(timeout)
    dispatch({
      type: 'SET_NOTIFICATION',
      content: text
    })
    timeout = setTimeout(
      () =>
        dispatch({
          type: 'SET_NOTIFICATION',
          content: null
        }),
      seconds * 1000
    )
  }
}

export default notificationReducer
