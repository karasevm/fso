import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Login from './components/Login'
import User from './components/User'
import BlogListItem from './components/BlogListItem'
import Navigation from './components/Navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment
} from './reducers/blogReducer'
import { logIn, logOut } from './reducers/userReducer'
import { initializeUserList } from './reducers/userListReducer'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Button, Col, ListGroup } from 'react-bootstrap'
import Users from './components/Users'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(({ blogs }) => blogs)
  const user = useSelector(({ user }) => user)
  const userList = useSelector(({ userList }) => userList)

  const userMatch = useRouteMatch('/users/:id')
  const userToDisplay =
    userMatch && userList
      ? userList.find(user => user.id === userMatch.params.id)
      : null
  //if (!userList.length && userMatch && !userToDisplay) history.push('/')

  const blogMatch = useRouteMatch('/blogs/:id')
  const blogToDisplay =
    blogMatch && blogs
      ? blogs.find(blog => blog.id === blogMatch.params.id)
      : null

  //if (!blogs.length && blogMatch && !blogToDisplay) history.push('/')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUserList())
  }, [dispatch, blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(logIn(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const showMessage = (message, success) =>
    dispatch(setNotification(message, success, 5))

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(logIn(user))
    } catch (exception) {
      showMessage('wrong username or password', false)
    }
  }

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  const likeBlogHandler = async blogObject => dispatch(updateBlog(blogObject))

  const deleteBlogHandler = async blogObject => {
    if (
      !window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      return
    }
    dispatch(deleteBlog(blogObject))
  }

  const addCommentHandler = async comment => {
    dispatch(addComment(blogToDisplay, comment))
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm addBlogHandler={addBlog} />
    </Togglable>
  )

  return (
    <div className="container">
      {user === null ? (
        <Login loginHandler={handleLogin} />
      ) : (
        <div>
          <Navigation>
            {user.name} logged in
            <Button
              variant="link"
              onClick={() => {
                window.localStorage.removeItem('loggedBlogappUser')
                dispatch(logOut())
              }}
            >
              logout
            </Button>
          </Navigation>
          <Notification />

          <Col xs={12}>
            <Switch>
              <Route path="/users/:id">
                <User user={userToDisplay} />
              </Route>
              <Route path="/blogs/:id">
                {blogToDisplay ? (
                  <Blog
                    blog={blogToDisplay}
                    likeHandler={likeBlogHandler}
                    deleteHandler={deleteBlogHandler}
                    commentHandler={addCommentHandler}
                    currentUser={user}
                  />
                ) : null}
              </Route>
              <Route path="/users">
                <Users userList={userList} />
              </Route>
              <Route path="/">
                <h2>Blogs</h2>
                <div>
                  {blogForm()}
                  <ListGroup className="blogsContainer">
                    {blogs
                      .sort((a, b) => b.likes - a.likes)
                      .map(blog => (
                        <BlogListItem key={blog.id} blog={blog} />
                      ))}
                  </ListGroup>
                </div>
              </Route>
            </Switch>
          </Col>
        </div>
      )}
    </div>
  )
}

export default App
