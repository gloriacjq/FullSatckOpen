import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange=({ target }) => setTitle(target.value)
  const handleAuthorChange=({ target }) => setAuthor(target.value)
  const handleUrlChange=({ target }) => setUrl(target.value)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          id='title'
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
          placeholder='write title here'
        />
      </div>
      <div>
        author:
        <input
          id='author'
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
          placeholder='write author here'
        />
      </div>
      <div>
        url:
        <input
          id='url'
          type="text"
          value={url}
          name="Url"
          onChange={handleUrlChange}
          placeholder='write url here'
        />
      </div>
      <button id='create-button' type="submit">create</button>
    </form>
  )
}

export default BlogForm