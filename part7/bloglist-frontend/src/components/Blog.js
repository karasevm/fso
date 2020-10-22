import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, ButtonGroup, ListGroup, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
const Blog = ({
  blog,
  likeHandler,
  deleteHandler,
  commentHandler,
  currentUser
}) => {
  const [newComment, setNewComment] = useState('')
  const history = useHistory()
  if (!blog) return null
  const likeBlog = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    likeHandler(newBlog)
  }

  const deleteBlog = () => {
    deleteHandler(blog)
    history.push('/')
  }

  const addComment = e => {
    e.preventDefault()
    commentHandler(newComment)
    setNewComment('')
  }

  return (
    <div className="blogContainer">
      <Card className="my-2 details">
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {blog.author}
          </Card.Subtitle>
          <Card.Text>likes {blog.likes}</Card.Text>
          <Card.Text>added by {blog.user.name || blog.user.username}</Card.Text>
          <Card.Link href="{blog.url}">{blog.url}</Card.Link>
        </Card.Body>
        <Card.Footer>
          <ButtonGroup>
            <Button onClick={likeBlog} id="like-button" variant="success">
              Like
            </Button>
            {currentUser.username === blog.user.username ? (
              <Button variant="danger" id="delete-button" onClick={deleteBlog}>
                Delete
              </Button>
            ) : null}
          </ButtonGroup>
        </Card.Footer>
      </Card>
      <h5>Leave a comment</h5>
      <Form className="my-2" onSubmit={addComment} inline>
        <Form.Label srOnly>Leave a comment</Form.Label>
        <Form.Control
          className="mb-2 mr-sm-2"
          type="text"
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
          name="comment"
          id="comment-input"
        />
        <Button type="submit" id="comment-button" className="mb-2">
          Add comment
        </Button>
      </Form>
      {blog.comments.length !== 0 ? (
        <Card className="commentsContainer">
          <Card.Header>Comments</Card.Header>

          <ListGroup variant="flush">
            {blog.comments.map((comment, index) => (
              <ListGroup.Item key={comment + index}>{comment}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      ) : null}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  commentHandler: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}
export default Blog
