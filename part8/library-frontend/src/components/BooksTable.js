import React from 'react'

const BooksTable = ({ books, filter, header }) => (
  <div>
    <h2>{header}</h2>

    <table>
      <tbody>
        <tr>
          <th></th>
          <th>
            author
          </th>
          <th>
            published
          </th>
        </tr>
        {books
          .filter(b => b.genres.reduce((acc, x) => acc || x.includes(filter), false))
          .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
              )
        }
      </tbody>
    </table>
  </div>
)

export default BooksTable
