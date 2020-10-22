import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

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
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            id="title"
            value={blogTitle}
            name="Blog Title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            id="author"
            value={blogAuthor}
            name="Blog Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            id="url"
            value={blogUrl}
            name="Blog Url"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </Form.Group>
        <Button type="submit" id="add-blog-button">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
