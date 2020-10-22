const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((prev, next) => prev + next.likes, 0)

const favouirteBlog = (blogs) => {
  if (blogs.length === 0) return {}
  const favBlog = blogs.reduce((prev, next) => (prev.likes > next.likes ? prev : next))
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}
  const postCount = _.countBy(blogs, 'author')
  const topBlogger = _.maxBy(_.keys(postCount), (o) => postCount[o])
  return {
    author: topBlogger,
    blogs: postCount[topBlogger]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}
  const likeCount = {}
  blogs.forEach((blog) => {
    if (blog.author in likeCount) {
      likeCount[blog.author] += blog.likes
    } else {
      likeCount[blog.author] = blog.likes
    }
  })
  const likedBlogger = _.maxBy(_.keys(likeCount), (o) => likeCount[o])
  return {
    author: likedBlogger,
    likes: likeCount[likedBlogger]
  }
}

module.exports = {
  dummy, totalLikes, favouirteBlog, mostBlogs, mostLikes
}
