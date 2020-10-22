import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(null)

  const populateBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    populateBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (message, success) => {
    setNotificationMessage(message)
    setNotificationSuccess(success)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationSuccess(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
      console.log(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage('wrong username or password', false)
    }
  }

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    showMessage(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      true
    )
  }

  const likeBlog = async blogObject => {
    const returnedBlog = await blogService.update(blogObject)
    setBlogs(
      blogs.map(blog => (blog.id !== blogObject.id ? blog : returnedBlog))
    )
  }

  const deleteBlog = async blogObject => {
    if (
      !window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      return
    }
    await blogService.remove(blogObject.id)
    setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm addBlogHandler={addBlog} />
    </Togglable>
  )
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification
          message={notificationMessage}
          success={notificationSuccess}
        />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              id="username"
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              id="password"
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notificationMessage}
        success={notificationSuccess}
      />
      <p>
        {user.name} logged in{' '}
        <button
          onClick={() => {
            window.localStorage.removeItem('loggedBlogappUser')
            setUser(null)
          }}
        >
          logout
        </button>
      </p>
      {blogForm()}
      <div className="blogsContainer">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              likeHandler={likeBlog}
              deleteHandler={
                blog.user.username === user.username ? deleteBlog : null
              }
            />
          ))}
      </div>
    </div>
  )
}

export default App
