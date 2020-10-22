import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ content, votes, handleClick }) => {
  return (
    <div>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = props => {
  const anecdotes =
    props.filter === ''
      ? props.anecdotes
      : props.anecdotes.filter(anecdote =>
          anecdote.content.toLowerCase().includes(props.filter.toLowerCase())
        )
  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <Anecdote
            content={anecdote.content}
            handleClick={() => props.voteHandler(anecdote)} //() => voteHandler(anecdote, dispatch)
            key={anecdote.id}
            votes={anecdote.votes}
          />
        ))}
    </div>
  )
}

const mapStateToProps = state => {
  // sometimes it is useful to console log from mapStateToProps
  console.log(state)
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    voteHandler: anecdote => {
      dispatch(voteAnecdote(anecdote))
      dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }
  }
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList
