import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
const Users = ({ userList }) => {
  return (
    <div>
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {userList &&
            userList.map(user => {
              return (
                <tr key={user.username}>
                  <td>
                    <Link to={`/users/${user.id}`}>
                      {user.name || user.username}
                    </Link>
                  </td>
                  <td>{user.blogs.length}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
