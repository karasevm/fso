const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlogs = [
  {
    _id: '5f5f933fadd55a05f054fa2f',
    title: 'Test1',
    author: 'Test Author1',
    url: 'https://example.com',
    likes: 10,
    __v: 0
  },
  {
    _id: '5f5f94fa8c5c5e067a592175',
    title: 'Test2',
    author: 'Test Author2',
    url: 'https://example.com/1',
    likes: 15,
    __v: 0
  },
  {
    _id: '5f5f961512424907717a4755',
    title: 'Test3',
    author: 'Test Author',
    url: 'https://example.com/1',
    likes: 132,
    __v: 0
  },
  {
    _id: '5f5f96efeeae2507db77d7ee',
    title: 'Test4',
    author: 'Test Author5',
    url: 'https://example.com/1',
    likes: 61,
    __v: 0
  },
  {
    _id: '5f5f97a1879d690847f340f5',
    title: 'Test5',
    author: 'Test Author',
    url: 'https://example.com/3',
    likes: 0,
    __v: 0
  },
  {
    _id: '5f5f961512424907717a4755',
    title: 'Test6',
    author: 'Test Author',
    url: 'https://example.com/1',
    likes: 22,
    __v: 0
  }
]

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of empty list is 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(listWithMultipleBlogs)).toBe(240)
  })
})

describe('favorite blog', () => {
  test('of a list with a single blog', () => {
    expect(listHelper.favouirteBlog(listWithOneBlog)).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('of a list with multiple blogs', () => {
    expect(listHelper.favouirteBlog(listWithMultipleBlogs)).toEqual({
      title: 'Test3',
      author: 'Test Author',
      likes: 132
    })
  })

  test('of an empty list', () => {
    expect(listHelper.favouirteBlog([])).toEqual({})
  })
})

describe('most blogs', () => {
  test('of a list with a single blog', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('of a list with multiple blogs', () => {
    expect(listHelper.mostBlogs(listWithMultipleBlogs)).toEqual({
      author: 'Test Author',
      blogs: 3
    })
  })

  test('of an empty list', () => {
    expect(listHelper.mostBlogs([])).toEqual({})
  })
})

describe('most likes', () => {
  test('of a list with a single blog', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('of a list with multiple blogs', () => {
    expect(listHelper.mostLikes(listWithMultipleBlogs)).toEqual({
      author: 'Test Author',
      likes: 154
    })
  })

  test('of an empty list', () => {
    expect(listHelper.mostLikes([])).toEqual({})
  })
})
