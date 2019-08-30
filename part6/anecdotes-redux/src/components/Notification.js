/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.9
 */
import React from 'react'

import { set } from '../reducers/notificationReducer'

const Notification = (props) => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
    }

    const note = props.store.getState().notification
    setTimeout(() => props.store.dispatch(set('')), 5000)

    return (
        <div style={style}>
        {note}
        </div>
    )
}

export default Notification
