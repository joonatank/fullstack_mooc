/*  Joonatan Kuosa
 *  2019-09-04
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 7.4 - 7.6
 */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/loginReducer'
import uiReducer from './reducers/uiReducer'
import flashReducer from './reducers/flashReducer'

const reducer = combineReducers({
    blogs: blogReducer,
    user: userReducer,
    ui: uiReducer,
    flash: flashReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store} >
        <App />
    </Provider>,
    document.getElementById('root')
)
