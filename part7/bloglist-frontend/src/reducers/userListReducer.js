import userService from '../services/users'

const userListReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_LIST':
    return action.data
  default:
    return state
  }
}

export const initializeUserList = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_LIST',
      data: users
    })
  }
}
export default userListReducer
