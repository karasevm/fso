import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
const BlogListItem = ({ blog }) => (
  <ListGroup.Item className="blogContainer">
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  </ListGroup.Item>
)
export default BlogListItem
