/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.3 - 6.8
 */
import freeze from 'deep-freeze'
import reducer, { setFlash } from './notificationReducer'

describe('notifcation reducer', () => {
    test('initial state is empty', () => {
        const state = reducer()
        expect(state).toBe('')
    })

    test('set a message', () => {
        const state = reducer()
        freeze(state)

        const msg = 'flash message'
        const newState = reducer(state, setFlash(msg))

        expect(newState).toBe(msg)
    })
})
