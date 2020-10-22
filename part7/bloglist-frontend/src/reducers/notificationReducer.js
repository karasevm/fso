const notificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION': {
    return action.data
      ? {
        content: action.data.text,
        success: action.data.success
      }
      : null
  }
  default:
    return state
  }
}

let timeout = null
export const setNotification = (text, success, seconds) => {
  return dispatch => {
    window.clearTimeout(timeout)
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        text,
        success
      }
    })
    timeout = setTimeout(
      () =>
        dispatch({
          type: 'SET_NOTIFICATION',
          data: null
        }),
      seconds * 1000
    )
  }
}

export default notificationReducer
