import React, { useState } from 'react'

const BlogForm = ({ addBlogHandler }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }
    addBlogHandler(blogObject)
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            id="title"
            value={blogTitle}
            name="Blog Title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            id="author"
            value={blogAuthor}
            name="Blog Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            id="url"
            value={blogUrl}
            name="Blog Url"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit" id="add-blog-button">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
