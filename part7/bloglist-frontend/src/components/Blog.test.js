import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog/>', () => {
  let component
  let mockLikeHandler
  let mockCommentHandler
  let mockDeleteHandler
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
      comments: ['preset comment'],
      id: '5f624df43da2240a8b6faa5e'
    }
    mockLikeHandler = jest.fn()
    mockCommentHandler = jest.fn()
    mockDeleteHandler = jest.fn()
    component = render(
      <Blog
        blog={blog}
        likeHandler={mockLikeHandler}
        currentUser={blog.user}
        commentHandler={mockCommentHandler}
        deleteHandler={mockDeleteHandler}
      />
    )
  })

  test('the content is visible', () => {
    const element = component.container.querySelector('.blogContainer')
    expect(element).toHaveTextContent('Test Title')
    expect(element).toHaveTextContent('Test Author')
    expect(element).toHaveTextContent('likes 22')
    expect(element).toHaveTextContent('preset comment')
  })

  test('when like button is clicked twice the event handler is called twice', () => {
    const button = component.container.querySelector('#like-button')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })

  test('when the comment is added the comment handler is called with the text content', () => {
    const input = component.container.querySelector('#comment-input')
    const form = component.container.querySelector('form')
    fireEvent.change(input, {
      target: { value: 'testing comments' }
    })
    fireEvent.submit(form)
    expect(mockCommentHandler.mock.calls).toHaveLength(1)
    expect(mockCommentHandler.mock.calls[0][0]).toBe('testing comments')
  })
})
