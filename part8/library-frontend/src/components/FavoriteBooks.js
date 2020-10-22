import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const FavoriteBooks = ({ show, user }) => {
  const [favoriteBooks, setFavoriteBooks] = useState(null)
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    console.log(show, user)
    if (show && user) {
      getBooks({
        variables: { genre: user.me.favoriteGenre }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, user])

  useEffect(() => {
    if (result.data) setFavoriteBooks(result.data.allBooks)
  }, [result])

  if (!show) {
    return null
  }
  if (!favoriteBooks) {
    return <div>loading</div>
  }
  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <b>{user.me.favoriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoriteBooks.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FavoriteBooks
