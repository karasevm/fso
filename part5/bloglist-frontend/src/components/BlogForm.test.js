import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls the event handler with the correct details', () => {
    const mockAddBlog = jest.fn()
    const component = render(<BlogForm addBlogHandler={mockAddBlog} />)

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')

    const form = component.container.querySelector('form')
    fireEvent.change(titleInput, {
      target: { value: 'correct title' }
    })
    fireEvent.change(authorInput, {
      target: { value: 'correct author' }
    })
    fireEvent.change(urlInput, {
      target: { value: 'correct url' }
    })

    fireEvent.submit(form)
    expect(mockAddBlog.mock.calls).toHaveLength(1)
    expect(mockAddBlog.mock.calls[0][0].title).toBe('correct title')
    expect(mockAddBlog.mock.calls[0][0].author).toBe('correct author')
    expect(mockAddBlog.mock.calls[0][0].url).toBe('correct url')
  })
})
