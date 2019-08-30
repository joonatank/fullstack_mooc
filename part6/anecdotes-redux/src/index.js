/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.16
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import service from './service'

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
