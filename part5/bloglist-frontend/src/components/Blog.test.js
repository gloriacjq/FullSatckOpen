import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog rendering', () => {
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

  const testUser = {
    username: 'admin',
    name: 'gloria'
  }

  test('initial display with correct content without details', () => {
    const { container } = render(<Blog blog={blog} />)

    const element = screen.getByText(`${blog.title} ${blog.author}`)
    const div = container.querySelector('.blogDetails')

    expect(element).toBeDefined()
    expect(div).toHaveStyle('display: none')
  })

  test('show details when click button', async () => {
    const { container } = render(<Blog blog={blog} user={testUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('like increased by two when click like twice', async () => {
    const mockHandler = jest.fn()

    render(<Blog blog={blog} user={user} likeBlog={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
