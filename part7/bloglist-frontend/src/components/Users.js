import React from 'react'

const Users = ({ users }) => (
    <div>
        <h1>Users</h1>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>blogs created</th>
                </tr>
            </thead>
            <tbody>
                {users.map(u =>
                    <tr key={u.name}>
                        <td>{u.name}</td>
                        <td>{u.blogs.length}</td>
                    </tr>
                    )
                }
            </tbody>
        </table>
    </div>
)

export default Users
