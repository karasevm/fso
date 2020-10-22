import React, { useEffect, useState } from 'react'
import {
  useApolloClient,
  useQuery,
  useSubscription,
  useLazyQuery
} from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import FavoriteBooks from './components/FavoriteBooks'

import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, ME } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const [getUser, user] = useLazyQuery(ME, {
    fetchPolicy: 'network-only'
  })

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    setPage('books')
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    if (token) {
      getUser()
    }
  }, [token, getUser])

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) setToken(storedToken)
  }, [])

  const addBookToCache = book => {
    const includedIn = (set, object) => set.map(p => p.id).includes(object.id)
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    console.log(dataInStore.allBooks, book)
    if (!includedIn(dataInStore.allBooks, book)) {
      try {
        client.writeQuery({
          query: ALL_BOOKS,
          data: { allBooks: dataInStore.allBooks.concat(book) }
        })
        console.log('writeQuery succeeded')
      } catch (e) {
        alert('Error adding new book to local cache')
        console.log(e.message)
      }
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      alert(`book ${subscriptionData.data.bookAdded.title} added to library`)
      addBookToCache(subscriptionData.data.bookAdded)
    }
  })

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>loading...</div>
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('favorite')}>recommendations</button>
            <button onClick={logout}>logout</button>
          </span>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors
        show={page === 'authors'}
        authors={resultAuthors.data.allAuthors}
        loggedIn={token}
      />

      <Books show={page === 'books'} books={resultBooks.data.allBooks} />

      <NewBook show={page === 'add'} addBookToCache={addBookToCache} />
      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />

      <FavoriteBooks show={page === 'favorite'} user={user.data} />
    </div>
  )
}

export default App
