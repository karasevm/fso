import React, { useState } from 'react'

const Books = ({ books, show }) => {
  const [filter, setFilter] = useState('')
  if (!show) {
    return null
  }
  const genres = [...new Set([].concat(...books.map(book => book.genres)))]
  console.log(genres, filter)
  const booksToDisplay = filter
    ? books.filter(book => book.genres.includes(filter))
    : books
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToDisplay.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books
