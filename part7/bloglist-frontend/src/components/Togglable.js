import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button, Col } from 'react-bootstrap'
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })
  return (
    <div className="my-2">
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <Col xs lg="6">
        <div style={showWhenVisible}>
          {props.children}
          <Button className="my-1" variant="light" onClick={toggleVisibility}>
            cancel
          </Button>
        </div>
      </Col>
    </div>
  )
})
Togglable.displayName = 'Togglable'
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
