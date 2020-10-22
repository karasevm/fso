import React, { useState } from 'react'
import Notification from './Notification'
import { Form, Button, Navbar, Row, Col } from 'react-bootstrap'
const Login = ({ loginHandler }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = event => {
    event.preventDefault()
    loginHandler(username, password)
    setUsername('')
    setPassword('')
  }
  return (
    <div>
      <Navbar bg="light">
        <Navbar.Brand href="/">Blog App</Navbar.Brand>
        <Navbar.Text>Log In</Navbar.Text>
      </Navbar>
      <Notification />
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                id="username"
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
                type="text"
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                id="password"
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Password"
              />
            </Form.Group>
            <Button id="login-button" variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Login
