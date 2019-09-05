/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7
 */
import React from 'react'

import { Link } from 'react-router-dom'

import { Table } from 'semantic-ui-react'

const Users = ({ users }) => (
    <div>
        <h1>Users</h1>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>blogs created</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {users.map(u =>
                    <Table.Row key={u.name}>
                        <Table.Cell>
                            <Link to={`/users/${u.id}`}>{u.name}</Link>
                        </Table.Cell>
                        <Table.Cell>{u.blogs.length}</Table.Cell>
                    </Table.Row>
                )
                }
            </Table.Body>
        </Table>
    </div>
)

export default Users
