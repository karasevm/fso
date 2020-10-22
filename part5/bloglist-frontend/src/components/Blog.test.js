import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog/>', () => {
  let component
  let mockLikeHandler
  beforeEach(() => {
    const blog = {
      likes: 22,
      title: 'Test Title',
      author: 'Test Author',
      url: 'https://example.com/',
      user: {
        username: 'root',
        name: 'Superuser',
        id: '5f6246b062be910869a64e76'
      },
      id: '5f624df43da2240a8b6faa5e'
    }
    mockLikeHandler = jest.fn()
    component = render(<Blog blog={blog} likeHandler={mockLikeHandler} />)
  })

  test('at the start only the title and author is visible', () => {
    const element = component.container.querySelector('.blogContainer')
    expect(element).toHaveTextContent('Test Title')
    expect(element).toHaveTextContent('Test Author')

    const detailsElement = component.container.querySelector('.details')
    expect(detailsElement).toHaveStyle('display: none')
  })

  test('url and number of likes are show when the show button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const detailsElement = component.container.querySelector('.details')
    expect(detailsElement).not.toHaveStyle('display: none')
  })

  test('when like button is clicked twice the event handler is called twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
