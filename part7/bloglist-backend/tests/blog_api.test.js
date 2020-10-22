const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)
beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})

  let passwordHash = await bcrypt.hash('sekret', 10)
  let user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  passwordHash = await bcrypt.hash('password', 10)
  user = new User({ username: 'toor', name: 'user', passwordHash })
  await user.save()
})
describe('blogs', () => {
  describe('with initial data', () => {
    test('correct amount of blogs returned as json', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the identifier property is named id', async () => {
      const response = await api.get('/api/blogs')
      for (const blog of response.body) {
        expect(blog.id).toBeDefined()
        expect(blog._id).not.toBeDefined()
      }
    })
  })
  describe('when adding blogs', () => {
    test('valid user can add blogs', async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const responseUser = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseUser.body.token).toBeDefined()

      const userToken = responseUser.body.token
      const newBlog = {
        title: 'test blog',
        author: 'test blog author',
        url: 'https://example.com',
        likes: 12
      }

      const responseBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const users = await helper.usersInDb()
      const userId = users[0].id
      expect(responseBlog.body.user.id).toBe(userId)
    })

    test('undefined likes property defaults to 0', async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const responseUser = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseUser.body.token).toBeDefined()

      const userToken = responseUser.body.token
      const newBlog = {
        title: 'test blog',
        author: 'test blog author',
        url: 'https://example.com'
      }

      const responseBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(responseBlog.body.likes).toBeDefined()
      expect(responseBlog.body.likes).toBe(0)
    })

    test('undefined title return 400', async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const responseUser = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseUser.body.token).toBeDefined()

      const userToken = responseUser.body.token

      const newBlogNoTitle = {
        likes: 3,
        author: 'test blog with no title author',
        url: 'https://example.com'
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlogNoTitle)
        .expect(400)
      const dbBlogs = await helper.blogsInDb()
      const authors = dbBlogs.map(blog => blog.author)
      expect(authors).not.toContain('test blog with no title author')
      expect(dbBlogs.length).toBe(helper.initialBlogs.length)
    })

    test('undefined url return 400', async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const responseUser = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseUser.body.token).toBeDefined()

      const userToken = responseUser.body.token

      const newBlogNoUrl = {
        title: 'test blog',
        author: 'test blog with no url author',
        likes: 12
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlogNoUrl)
        .expect(400)

      const dbBlogs = await helper.blogsInDb()
      const authors = dbBlogs.map(blog => blog.author)
      expect(authors).not.toContain('test blog with no url author')
      expect(dbBlogs).toHaveLength(helper.initialBlogs.length)
    })

    test('request to create blog without authorization returns 401', async () => {
      const newBlog = {
        title: 'test blog',
        author: 'test blog author',
        url: 'https://example.com',
        likes: 12
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogs = await helper.blogsInDb()
      const titles = blogs.map(blog => blog.title)
      expect(titles).not.toContain('test blog')
    })

    test('request to create blog with malformed authorization returns 401', async () => {
      const newBlog = {
        title: 'test blog',
        author: 'test blog author',
        url: 'https://example.com',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer 2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNjI0NmIw')
        .send(newBlog)
        .expect(401)

      const blogs = await helper.blogsInDb()
      const titles = blogs.map(blog => blog.title)
      expect(titles).not.toContain('test blog')
    })
  })

  describe('when deleting blogs', () => {
    test('valid user can delete their blog', async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const responseUser = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseUser.body.token).toBeDefined()
      const userToken = responseUser.body.token
      const newBlog = {
        title: 'test blog',
        author: 'test blog author',
        url: 'https://example.com',
        likes: 12
      }

      const responseBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogId = responseBlog.body.id
      const blogs = await helper.blogsInDb()
      const blogsIds = blogs.map(blog => blog.id)
      expect(blogsIds).toContain(blogId)

      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const newBlogs = await helper.blogsInDb()
      const newBlogsIds = newBlogs.map(blog => blog.id)
      expect(newBlogsIds).not.toContain(blogId)
    })
    test("valid user can't delete blogs of other users", async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const responseUser = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseUser.body.token).toBeDefined()
      const userToken = responseUser.body.token
      const newBlog = {
        title: 'test blog',
        author: 'test blog author',
        url: 'https://example.com',
        likes: 12
      }

      const responseBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogId = responseBlog.body.id
      const blogs = await helper.blogsInDb()
      const blogsIds = blogs.map(blog => blog.id)
      expect(blogsIds).toContain(blogId)

      const otherUserData = {
        username: 'toor',
        password: 'password'
      }
      const responseOtherUser = await api
        .post('/api/login')
        .send(otherUserData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(responseOtherUser.body.token).toBeDefined()

      const otherUserToken = responseOtherUser.body.token

      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(401)

      const newBlogs = await helper.blogsInDb()
      const newBlogsIds = newBlogs.map(blog => blog.id)
      expect(newBlogsIds).toContain(blogId)
    })
  })

  describe('when updating blog', () => {
    test('updating a blogs likes count by id returns 200', async () => {
      const dbBlogs = await helper.blogsInDb()
      const blogToUpdate = dbBlogs[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        author: blogToUpdate.author,
        likes: blogToUpdate.likes + 10
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const dbUpdatedBlog = await helper.blogInDbById(blogToUpdate.id)
      expect(dbUpdatedBlog.likes).toBe(blogToUpdate.likes + 10)
    })
    test('adding a comment returns 200', async () => {
      const dbBlogs = await helper.blogsInDb()
      const blogToUpdate = dbBlogs[0]

      const comment = {
        comment: 'new test comment'
      }

      await api
        .post(`/api/blogs/${blogToUpdate.id}/comments`)
        .send(comment)
        .expect(200)

      const dbUpdatedBlog = await helper.blogInDbById(blogToUpdate.id)
      expect(dbUpdatedBlog.comments).toContain('new test comment')
    })
  })
})

describe('users', () => {
  describe('user creation', () => {
    test('user with correct info can be added', async () => {
      const newUser = {
        username: 'test',
        name: 'Test User',
        password: 'Test Password'
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const newUsers = await helper.usersInDb()
      const usernames = newUsers.map(user => user.username)
      expect(usernames).toContain('test')
    })

    test('user with duplicate username returns 400', async () => {
      const newUser = {
        username: 'root',
        name: 'Test User',
        password: 'Test Password'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const newUsers = await helper.usersInDb()
      const names = newUsers.map(user => user.name)

      expect(names).not.toContain('Test User')
    })

    test('user with 2 character username returns 400', async () => {
      const newUser = {
        username: 'ro',
        name: 'Test User',
        password: 'Test Password'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const newUsers = await helper.usersInDb()
      const names = newUsers.map(user => user.name)

      expect(names).not.toContain('Test User')
    })

    test('user with 2 character password returns 400', async () => {
      const newUser = {
        username: 'root',
        name: 'Test User',
        password: 'Te'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const newUsers = await helper.usersInDb()
      const names = newUsers.map(user => user.name)

      expect(names).not.toContain('Test User')
    })
  })

  describe('user authentication', () => {
    test('valid user can login', async () => {
      const userData = {
        username: 'root',
        password: 'sekret'
      }
      const response = await api
        .post('/api/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.token).toBeDefined()
    })

    test("invalid user can't login", async () => {
      const userData = {
        username: 'root',
        password: 'sekretq'
      }
      await api
        .post('/api/login')
        .send(userData)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
