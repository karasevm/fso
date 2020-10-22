const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Test1',
    author: 'Test Author1',
    url: 'https://example.com',
    likes: 10
  },
  {
    title: 'Test2',
    author: 'Test Author2',
    url: 'https://example.com/1',
    likes: 15
  },
  {
    title: 'Test3',
    author: 'Test Author',
    url: 'https://example.com/1',
    likes: 132
  },
  {
    title: 'Test4',
    author: 'Test Author5',
    url: 'https://example.com/1',
    likes: 61
  },
  {
    title: 'Test5',
    author: 'Test Author',
    url: 'https://example.com/3',
    likes: 0
  },
  {
    title: 'Test6',
    author: 'Test Author',
    url: 'https://example.com/1',
    likes: 22
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const blogInDbById = async (id) => {
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const userInDbById = async (id) => {
  const user = await User.findById(id)
  return user.toJSON()
}

module.exports = {
  initialBlogs, blogsInDb, blogInDbById, usersInDb, userInDbById
}
