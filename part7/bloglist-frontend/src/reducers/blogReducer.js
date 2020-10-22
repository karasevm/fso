import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'INIT_BLOGS':
    return action.data
  case 'UPDATE_BLOG': {
    const id = action.data.id
    return state.map(blog => (blog.id !== id ? blog : action.data))
  }
  case 'DELETE_BLOG': {
    const id = action.data.id
    return state.filter(blog => blog.id !== id)
  }

  default:
    return state
  }
}

export const createBlog = content => {
  return async dispatch => {
    try{
      const newBlog = await blogService.create(content)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })

      dispatch(setNotification(
        `a new blog ${content.title} by ${content.author} added`,
        true, 5))
    } catch (e) {
      dispatch(setNotification(
        'error adding blog',
        false, 5))
    }
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const updateBlog = blogObject => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blogObject)
    dispatch({
      type: 'UPDATE_BLOG',
      data: updatedBlog
    })
  }
}

export const deleteBlog = blogObject => {
  return async dispatch => {
    await blogService.remove(blogObject.id)
    dispatch({
      type: 'DELETE_BLOG',
      data: blogObject
    })
  }
}

export const addComment = (blogObject, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.comment(blogObject.id, comment)
    dispatch({
      type: 'UPDATE_BLOG',
      data: updatedBlog
    })
  }
}

export default blogReducer
