import React, { useState } from 'react'

const EditAuthor = ({ editAuthor }) => {
  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    const y = parseInt(born)
    editAuthor({
      variables: { name, born: y }
    }).then(res => {
      setName('')
      setBorn('')
    })
    // TODO error handling (alerts)
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        name <input value={name} onChange={({ target }) => setName(target.value)} /><br />
        born <input value={born} onChange={({ target }) => setBorn(target.value)} /><br />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor
