import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE': {
      return state.map(anecdote =>
        anecdote.id !== action.data.id ? anecdote : action.data
      )
    }
    case 'NEW_ANECDOTE': {
      return [...state, action.data]
    }
    case 'INIT_ANECDOTES': {
      return action.data
    }
    default:
      return state
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    console.log(anecdote, newAnecdote)
    const voteResult = await anecdoteService.update(anecdote.id, newAnecdote)
    dispatch({
      type: 'VOTE',
      data: voteResult
    })
  }
}

export const initAnecdotes = () => {
  return async dispatch => {
    const data = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data
    })
  }
}

export default anecdoteReducer
