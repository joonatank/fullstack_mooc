/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 5.1 - 5.3
 *
 *  Flash component
 */
import React from 'react'

const Flash = ({ msg, look }) => {
    if (msg === null || msg === '') {
        return null
    }
    else {
        return (
            <div className={look}>
                {msg}
            </div>
        )
    }
}

export default Flash
