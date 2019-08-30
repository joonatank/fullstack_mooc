/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.14
 */
import React from 'react'
import { connect } from 'react-redux'

import { set } from '../reducers/notificationReducer'

const Notification = (props) => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1
    }

    const note = props.notification
    setTimeout(() => props.set(''), 5000)

    return (
        <div style={style}>
        {note}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

const mapDispatchToProps = {
    set,
}

const ConnectedNotification= connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification)

export default ConnectedNotification
