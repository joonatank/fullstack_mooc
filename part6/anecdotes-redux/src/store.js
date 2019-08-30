import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import nReducer from './reducers/notificationReducer'
import aReducer from './reducers/anecdoteReducer'
import fReducer from './reducers/filterReducer'

const reducer = combineReducers({
    anecdotes: aReducer,
    notification: nReducer,
    filter: fReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
