const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.wsaitk0.mongodb.net/testBlogApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length===5) {
  const title = process.argv[3]
  const author = process.argv[4]
  const blog = new Blog({
    title: title,
    author: author,
    url: 'url-test',
    likes: 5
  })
  blog.save().then(() => {
    console.log(`added ${title} by ${author} to bloglist`)
    mongoose.connection.close()
  })
} else {
  Blog.find({}).then(blogs => {
    console.log('blogs:')
    blogs.forEach(blog => {
      console.log(`${blog.title} ${blog.author}`)
    })
    mongoose.connection.close()
  })
}
