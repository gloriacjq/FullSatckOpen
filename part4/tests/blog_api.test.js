const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
      .expect(201)
    const users = await helper.usersInDb()
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: users[0].id }))
    await Blog.insertMany(blogObjects)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog from Edsger W. Dijkstra is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const authors = response.body.map(e => e.author)
    assert(authors.includes('Edsger W. Dijkstra'))
  })

  test('blogs have property named id', async () => {
    const response = await api.get('/api/blogs')

    const idExist = response.body.some(o => Object.keys(o).includes('id'))
    assert(idExist)
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added with authorized user', async () => {
      const user = {
        username: 'admin',
        password: 'fullstack',
      }
      const newBlog = {
        title: 'Valid new blog tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }

      const response = await api
        .post('/api/login')
        .send(user)

      const loginToken = response.body.token

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('authorization',`Bearer ${loginToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(titles.includes('Valid new blog tests'))
    })

    test('a valid blog cannot be added without authorized user', async () => {
      const newBlog = {
        title: 'New blog tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes('New blog tests'))
    })

    test('missing likes property is set as 0 by default', async () => {
      const user = {
        username: 'admin',
        password: 'fullstack',
      }

      const newBlog = {
        title: 'Valid new blog tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
      }

      const loginRes = await api
        .post('/api/login')
        .send(user)

      const loginToken = loginRes.body.token

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('authorization',`Bearer ${loginToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog = response.body
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('blogs without url or title are not added', async () => {
      const user = {
        username: 'admin',
        password: 'fullstack',
      }

      const loginRes = await api
        .post('/api/login')
        .send(user)

      const loginToken = loginRes.body.token

      const newBlog1 = {
        title: 'Valid new blog tests',
        author: 'Robert C. Martin',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog1)
        .set('authorization',`Bearer ${loginToken}`)
        .expect(400)

      const newBlog2 = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog2)
        .set('authorization',`Bearer ${loginToken}`)
        .expect(400)

      const newBlog3 = {
        author: 'Robert C. Martin',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog3)
        .set('authorization',`Bearer ${loginToken}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const user = {
        username: 'admin',
        password: 'fullstack',
      }

      const response = await api
        .post('/api/login')
        .send(user)

      const loginToken = response.body.token

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('authorization',`Bearer ${loginToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map(r => r.title)
      assert(!contents.includes(blogToDelete.title))
    })
  })

  describe('update of a blog', () => {
    test('succeed to update if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        title: blogToUpdate.blogToUpdate,
        author: 'update test',
        url: blogToUpdate.url,
        likes: blogToUpdate.likes
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const authors = blogsAtEnd.map(r => r.author)
      assert(authors.includes(updatedBlog.author))
    })
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
