import React, { useState } from 'react'

import BooksTable from './BooksTable'

const Recom = ({ result, user }) => {

  if (result.loading || user.loading) {
    return <div>loading...</div>
  }
  else if (result.error || user.error ) {
    return <div>error...</div>
  }
  else {
    const books = result.data.allBooks

    return (
      <div>
        <p>Books in your favorite genre.</p>
        <BooksTable books={books} header={'Recomendations'} />
      </div>
    )
  }
}

export default Recom
