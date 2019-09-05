/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4
 *
 *  Flash component
 */
import React from 'react'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'

import { setFlash } from '../reducers/flashReducer'

const Flash = (props) => {
    const msg = props.msg
    const look = props.look

    if (msg === undefined || msg === null || msg === '') {
        return null
    }
    else if (look === 'error') {
        return (
            <Message negative>
                <p> {msg} </p>
            </Message>
        )
    }
    else {
        return (
            <Message positive>
                <p> {msg} </p>
            </Message>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        msg: state.flash.msg,
        look: state.flash.look,
    }
}

export default connect(
    mapStateToProps,
    { setFlash }
)(Flash)
