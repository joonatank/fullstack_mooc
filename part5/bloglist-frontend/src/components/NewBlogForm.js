/*  Joonatan Kuosa
 *  2019-09-04
 *
 */
import React, { useState } from 'react'

/// params:
/// visibleCb : function that takes one boolean for visiblity, returns nothing
/// newBlogCb: function that takes (event, {string, string, string}),
///     returns promise with boolean for success or failure of posting
const NewBlogForm = ({ visibleCb, newBlogCb }) => {
    // New blog
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const handleSubmit = (e) => {
        // Clear the state variables if we succeed
        newBlogCb(e, { newTitle, newAuthor, newUrl }).then((res) => {
            if (res) {
                setNewTitle('')
                setNewAuthor('')
                setNewUrl('')
            }
            else {
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create new blog link</h2>
            <div>
                title
                <input type='text' value={newTitle} name='title'
                    onChange={ ({ target }) => setNewTitle(target.value) }
                />
            </div>
            <div>
                author
                <input type='text' value={newAuthor} name='author'
                    onChange={ ({ target }) => setNewAuthor(target.value) }
                />
            </div>
            <div>
                url
                <input type='text' value={newUrl} name='url'
                    onChange={ ({ target }) => setNewUrl(target.value) }
                />
            </div>
            <button type='submit'>create</button>
            <button onClick={() => visibleCb(false)}>cancel</button>
        </form>
    )
}

export default NewBlogForm
