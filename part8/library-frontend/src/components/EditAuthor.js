import React, { useState } from 'react'
import Select from 'react-select'

const EditAuthor = ({ result, editAuthor }) => {
  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')

  const authors = result.loading ? [] : result.data.allAuthors
  const options = authors.map(x => ({ value: x.name, label: x.name }))

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

  const handleSelect = (selected) => {
    const str = selected.value
    setName(str)
    const author = authors.filter(x => x.name === str)[0]
    setBorn('')
    if (author.born) {
      setBorn(author.born)
    }
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <br />
      <form onSubmit={submit}>
        <Select value={{value: name, label: name}}
            onChange={handleSelect} options={options} />
        born <input value={born} onChange={({ target }) => setBorn(target.value)} /><br />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor
