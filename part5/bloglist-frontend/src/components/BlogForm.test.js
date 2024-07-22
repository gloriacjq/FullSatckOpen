import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe('BlogForm rendering', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 5,
    user: {
      username: 'admin',
      name: 'gloria'
    }
  }

  test('a new blog gets created when submitting the blogform', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const title = screen.getByPlaceholderText('write title here')
    const author = screen.getByPlaceholderText('write author here')
    const url = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    await user.type(title, blog.title)
    await user.type(author, blog.author)
    await user.type(url, blog.url)
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
  })
})
