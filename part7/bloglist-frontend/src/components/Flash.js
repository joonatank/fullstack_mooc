/*  Joonatan Kuosa
 *  2019-08-29
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4
 *
 *  Flash component
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'

import { setFlash } from '../reducers/flashReducer'

const Flash = ({ msg, look }) => (
    !msg
        ? null
        : (look === 'error')
            ? ( <Message negative>
                <p> {msg} </p>
            </Message>
            )
            : ( <Message positive>
                <p> {msg} </p>
            </Message>
            )
)

Flash.propTypes = {
    msg: PropTypes.string,
    look: PropTypes.string,
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
