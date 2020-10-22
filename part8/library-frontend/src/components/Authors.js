import React, { useState, useEffect } from 'react'
import { EDIT_AUTHOR } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = ({ authors, loggedIn, show }) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [editAuthor, result] = useMutation(EDIT_AUTHOR)

  const updateAuthor = e => {
    e.preventDefault()
    editAuthor({ variables: { name, year: Number(year) } })
    setYear('')
  }
  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      alert('person not found')
    }
  }, [result.data])

  useEffect(() => {
    if (authors.length) {
      setName(authors[0].name)
    }
  }, [authors])

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loggedIn && authors.length ? (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={updateAuthor}>
            <div>
              name
              <select
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map(a => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                value={year}
                onChange={({ target }) => setYear(target.value)}
              />
            </div>
            <button>update author</button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default Authors
