// const maxBy = require('lodash/maxBy')
const _ = require('lodash')

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (previous_max, item) => {
    return (previous_max && previous_max.likes > item.likes) ? previous_max : item
  }
  const favblog = blogs.reduce(reducer, null)
  return favblog
    ? {
      title: favblog.title,
      author: favblog.author,
      likes: favblog.likes
    }
    : null
}

const mostLikes = (blogs) => {
  const reducer = (counter, item) => {
    counter[item.author] = (counter[item.author] || 0) + item.likes
    return counter
  }
  const likesCountByAuthor = _.reduce(blogs, reducer, {})
  const topAuthor = _.maxBy(_.keys(likesCountByAuthor), (key) => { return likesCountByAuthor[key] })
  return topAuthor
    ? {
      author: topAuthor,
      likes: likesCountByAuthor[topAuthor]
    }
    : null
}

const mostBlogs = (blogs) => {
  const blogsCountByAuthor = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(_.keys(blogsCountByAuthor), (key) => { return blogsCountByAuthor[key] })
  return topAuthor
    ? {
      author: topAuthor,
      blogs: blogsCountByAuthor[topAuthor]
    }
    : null
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
}