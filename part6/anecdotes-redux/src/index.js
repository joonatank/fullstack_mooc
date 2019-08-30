import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
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
        <App store={store} />,
        document.getElementById('root')
    )
}

render()
store.subscribe(render)
