import { useState } from 'react'

const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenOwned = { display: blog.user?.username === user?.username ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = (event) => {
    event.preventDefault()
    likeBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='blogInfo'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>view</button>
        <button onClick={toggleVisibility} style={showWhenVisible}>hide</button>
      </div>
      <div style={showWhenVisible} className='blogDetails'>
        {blog.url} <br/>
        <div>
          likes {blog.likes}
          <button onClick={addLike}>like</button> <br/>
        </div>
        {blog.user?.name} <br/>
        <button onClick={() => deleteBlog(blog)} style={showWhenOwned}>remove</button>
      </div>
    </div>
  )
}

export default Blog