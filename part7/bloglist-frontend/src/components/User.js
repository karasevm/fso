import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'
const User = ({ user }) => {
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <Card>
        <Card.Header>Added blogs</Card.Header>

        {user.blogs ? (
          <ListGroup variant="flush">
            {user.blogs.map(blog => {
              return <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
            })}
          </ListGroup>
        ) : null}
      </Card>
    </div>
  )
}

export default User
