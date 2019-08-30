/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.11
 */

const initialState = ''

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FILTER':
            return action.filter;
        default:
            return state;
    }
}

const filter = (x) => ({ type: 'FILTER', filter: x })

export { filter }
export default reducer
