/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.14
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './App'

import nReducer from './reducers/notificationReducer'
import aReducer from './reducers/anecdoteReducer'
import fReducer from './reducers/filterReducer'

const reducer = combineReducers({
    anecdotes: aReducer,
    notification: nReducer,
    filter: fReducer
})

const store = createStore(reducer)

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
        <App />,
        </Provider>,
        document.getElementById('root')
    )
}

render()
store.subscribe(render)
