import React, { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog, likeHandler, deleteHandler }) => {
  const [detailsVisibility, setDetailsVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: detailsVisibility ? '' : 'none' }

  const toggleDetailsVisibility = () => {
    setDetailsVisibility(!detailsVisibility)
  }

  const likeBlog = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    likeHandler(newBlog)
  }

  const deleteBlog = () => {
    deleteHandler(blog)
  }
  return (
    <div style={blogStyle} className="blogContainer">
      {blog.title} {blog.author}
      <button onClick={toggleDetailsVisibility}>
        {detailsVisibility ? 'hide' : 'view'}
      </button>
      <div style={showWhenVisible} className="details">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button onClick={likeBlog} className="likeButton">
            like
          </button>
        </div>
        <div>{blog.user.name || blog.user.username}</div>
        {deleteHandler && (
          <div>
            <button onClick={deleteBlog}>delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func
}
export default Blog
