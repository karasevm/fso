const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// List blogs endpoint
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Add blog endpoint
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const responseBlog = await savedBlog
    .populate('user', { username: 1, name: 1 })
    .execPopulate()
  response.status(201).json(responseBlog)
})

// Delete blog endpoint
blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).end()
  }
})

// Update blog endpoint
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    comments: body.comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
  const responseBlog = await updatedBlog
    .populate('user', { username: 1, name: 1 })
    .execPopulate()
  response.json(responseBlog)
})

// Add comment endpoint
blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const body = request.body

  const newBlog = {
    title: blog.title,
    url: blog.url,
    author: blog.author,
    likes: blog.likes,
    comments: [...blog.comments, body.comment]
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true
  })

  const responseBlog = await updatedBlog
    .populate('user', { username: 1, name: 1 })
    .execPopulate()
  response.json(responseBlog)
})

module.exports = blogsRouter
